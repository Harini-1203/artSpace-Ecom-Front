import { Heart, ShoppingCart, User } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getCart } from "../../api/cartAPI";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const navigate = useNavigate();

  // fetch cart count on load
  const fetchCartCount = async () => {
    try {
      const data = await getCart();
      setCartCount(data.length);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // listen for updates (custom event)
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) setUser(JSON.parse(userData));
    else setUser(null);

    const handleStorage = (e) => {
      if (e.key === "token" || e.key === "user") {
        const newToken = localStorage.getItem("token");
        const newUser = localStorage.getItem("user");
        if (newToken && newUser) setUser(JSON.parse(newUser));
        else setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-[var(--brand-blue)] via-sky-600 to-[var(--brand-blue)] shadow-lg backdrop-blur-lg bg-opacity-90 text-white sticky top-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div
        className="text-md md:text-2xl font-semibold tracking-tight cursor-pointer hover:opacity-90 transition"
        onClick={() => navigate("/")}
      >
        <span className="text-white">Dheeraj</span>
        <span className="text-sky-200">Artworks</span>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6">
        
        {/* Wishlist */}
        <button
          onClick={() => navigate("/wishlist")}
          className="relative  hover:scale-110 transition-transform duration-200"
        >
          <Heart className="w-5 h-5 md:w-6 md:h-6  hover:text-sky-200 transition-colors" />
        </button>

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="relative hover:scale-110 transition-transform duration-200"
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 hover:text-sky-200 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-sky-400 text-xs text-white rounded-full px-1.5 shadow-md">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center justify-center hover:scale-110 transition-transform duration-200"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <User className="w-5 h-5 md:w-6 md:h-6 hover:text-sky-200 transition-colors" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-gray-700 rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 z-50">
              {user ? (
                <div className="p-3">
                  <div className="font-semibold mb-2 text-sm border-b pb-2">
                    Hello, {user.name || user.email}
                  </div>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/orders");
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-red-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="p-3">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-[var(--brand-blue)] font-medium"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login / Signup
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
