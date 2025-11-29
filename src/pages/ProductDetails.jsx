// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { addToCart,getCart } from "../api/cartAPI";
import { API_URL } from "../../config.js";

const API_BASE = `${API_URL}/api`;

export default function ProductDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  
  // ✅ Fetch product
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    })();
  }, [id]);

  // ✅ Fetch cart
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getCart();
        setCart(data.cart || data); // depends on your backend response structure
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    })();
  }, [token]);

  // ✅ Fetch wishlist
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/users/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(data.wishlist || data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    })();
  }, [token]);

    // ✅ Add to cart handler
  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await addToCart(product._id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
      const updated = await getCart();
      setCart(updated.cart || updated);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // ✅ Check if in cart
  const isInCart = useMemo(() => {
    if (!product || !cart.length) return false;
    return cart.some(
      (item) => item.product._id === product._id
    );
  }, [cart, product]);

  // ✅ Check if in wishlist
  const isInWishlist = useMemo(() => {
    if (!product || !wishlist.length) return false;
    const first = wishlist[0];
    if (typeof first === "string") return wishlist.includes(product._id);
    return wishlist.some((w) => w?._id === product._id);
  }, [wishlist, product]);

  const images = useMemo(
    () => product?.images?.length ? product.images : [],
    [product]
  );

  const price = product?.price ?? 0;
  const mrp = product?.mrp || product?.compareAtPrice || null;

  // ✅ Toggle wishlist handler
  const toggleWishlist = async () => {
    if (!token) {
      alert("Please login to use wishlist");
      return;
    }
    try {
      const { data } = await axios.put(
        `${API_BASE}/users/wishlist/${product._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(data.wishlist || data);
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };


  if (!product) return <div className="p-6 text-gray-500">Loading product...</div>;


  return (
    <div className="max-w-7xl mt-5 md:mt-10  mx-auto p-4 lg:p-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Images */}
        <div className="lg:col-span-7">
          {/* Desktop gallery */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4">
            {/* Vertical thumbs */}
            <div className="col-span-2 flex flex-col gap-3">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`border rounded-lg overflow-hidden h-20 focus:outline-none ${
                    activeIdx === idx ? "border-gray-900" : "border-gray-200"
                  }`}
                >
                  <img
                    src={src}
                    alt={`thumbnail-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            {/* Main image (slightly smaller look) */}
            <div className="col-span-10">
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={images[activeIdx]}
                  alt={product.name}
                  className="w-full object-contain"
                  style={{ maxHeight: "72vh" }} // a bit smaller than full height
                />
                {/* Optional badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile slider */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 no-scrollbar">
              {images.map((src, idx) => (
                <div key={idx} className="min-w-full snap-center">
                  <img
                    src={src}
                    alt={`${product.name}-${idx}`}
                    className="w-full h-[420px] object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* More details below (scroll area) */}
          
        </div>

        {/* RIGHT: Sticky details */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: product.name,
                          url: window.location.href,
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }
                  }}
                  className="p-2 rounded-full border border-gray-200 text-gray-600"
                  title="Share"
                >
                  <FaShareAlt className="text-lg" />
                </button>
              </div>
              
            </div>
                  <p>{product.description}</p>
            {/* Rating (dummy if not present) */}
            {/* <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating ?? 4.9}
              </span>
            </div> */}

            <h1 className="font-bold text-2xl">₹ {product.price}</h1>

            <hr className="my-5" />
          {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (isInCart) {
                    window.location.href = "/cart"; // navigate to cart page
                  } else {
                    handleAddToCart();
                  }
                }}
                className={`w-full rounded-xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg text-center font-semibold shadow-sm transition 
                  bg-gradient-to-r from-[var(--blue-light)] to-sky-500 text-white hover:opacity-100
                  ${
                  
                  isInCart
                    && "bg-gray-400 cursor-not-allowed"
                     
                }`}
              >
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={toggleWishlist}
                className={`w-full rounded-xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-lg text-center font-semibold shadow-sm flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? "bg-red-100 text-red-600 border border-red-400"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <FaHeart className={`text-xl ${isInWishlist ? "fill-current text-red-500" : "text-gray-400"}`} />
                {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>


          </div>
          <div className="mt-8 space-y-6">
            <hr />
            <section>
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </section>
            {product.attributes && (
              <section className="space-y-1">
                <h4 className="font-semibold">Specifications</h4>
                <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 ">
                  {Object.entries(product.attributes).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-medium">{k}:</span>{" "}
                      <span>
                        {Array.isArray(v) ? v.join(", ") : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Add more sections like Care, Shipping, Returns if you have */}
          </div>
        </div>
      </div>

      
    </div>
  );
}
