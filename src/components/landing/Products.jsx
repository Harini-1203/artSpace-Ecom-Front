// Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import { API_URL } from "../../config.js";

export const Products = ({ onCartChange }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`, { withCredentials: true } )
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.wishlist) {
      setWishlist(storedUser.wishlist);
    }
  }, []);

  // Add to cart
  const addToCart = (e, product) => {
    e.stopPropagation();
    if (cart.some((item) => item && item._id === product._id)) return;
    const updatedCart = [...cart, { ...product, qty: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (onCartChange) onCartChange(updatedCart.length);
  };

  // Toggle wishlist
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

      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      storedUser.wishlist = res.data.wishlist;
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  // Helpers
  const isInCart = (product) =>
    cart.some((item) => item && item._id === product._id);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);

  return (
    <div className="grid grid-cols-2 mx-8 lg:mx-5 gap-4  md:gap-8 md:p-4 sm:grid-cols-2 md:grid-cols-4"
      id="products"
    >
      {products.map((product) => (
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
  );
};

export default Products;
