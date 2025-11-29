// components/ProductCard.jsx
import React from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  isInWishlist,
  toggleWishlist,
  isInCart,
  addToCart,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white group lg:mx-10 overflow-hidden cursor-pointer relative"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Wishlist Heart Icon */}
      <button
        className="absolute z-5 top-2 right-2 text-xl cursor-pointer"
        onClick={(e) => toggleWishlist(e, product._id)}
      >
        <FaHeart
          className={isInWishlist(product._id) ? "text-red-500" : "text-white"}
        />
      </button>
      <div className="group relative">
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/300x400"
        }
        alt={product.name}
        className="w-full shadow-inner h-60 md:h-75 object-cover"
      />
        </div>
      <div className="p-2 text-center">
        <h3 className="md:text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-700 font-medium ">₹{product.price}</p>
        {/* <p className="text-sm text-gray-500 ">{product.description}</p> */}
      </div>
    </div>
  );
}

