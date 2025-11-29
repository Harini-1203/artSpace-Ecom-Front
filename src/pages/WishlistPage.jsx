import React, { useEffect, useState  } from "react";
import axios from "axios";
import ProductCard from "../components/landing/ProductCard";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/users/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWishlistProducts(res.data);
        setWishlist(res.data); // assuming res.data is product objects
      })
      .catch((err) => console.error("Error fetching wishlist:", err));

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [token]);

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!token) {
      alert("Please login to use wishlist");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  const addToCart = (e, product) => {
    e.stopPropagation();
    if (cart.some((item) => item._id === product._id)) return;
    const updatedCart = [...cart, { ...product, qty: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);
  const isInCart = (product) =>
    cart.some((item) => item._id === product._id);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">My Wishlist</h2>
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isInWishlist={isInWishlist}
              toggleWishlist={toggleWishlist}
              isInCart={isInCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" 
              fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="var(--brand-blue)"
              className="w-16 h-16 mb-4 opacity-70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5S12 5.765 12 8.25 9.985 12.75 7.5 12.75 3 10.735 3 8.25 5.015 3.75 7.5 3.75 12 7.515 12 12c0 4.485-4.485 8.25-4.5 8.25S3 16.485 3 12"/>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-6">Add some artworks you love — they’ll live here 💙</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--blue-light)] to-sky-500 hover:opacity-100 text-white font-medium hover:opacity-90 transition"
          >
            Explore Artworks
          </button>
        </div>

      )}
    </div>
  );
}
