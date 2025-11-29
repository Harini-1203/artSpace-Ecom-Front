// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/landing/Navbar";
import React, { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import WishlistPage from "./pages/WishlistPage";
import ProductDetail from "./pages/ProductDetails";
import ForgotPassword from "./components/form/ForgotPassword";
import ResetPassword from "./components/form/ResetPassword";

import AdminHome from "./pages/AdminHome";
import Orders from "./components/admin/Orders";
import OrderDetails from "./components/admin/OrderDetails";
import Products from "./components/admin/Products";
import AddProduct from "./components/admin/AddProduct";

import MyOrders from "./pages/MyOrders";


function App() {
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count from localStorage on mount and when cart changes
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(storedCart.length);
    // Listen for cart changes in other tabs/windows
    const handleStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(updatedCart.length);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar at top */}
        <Navbar cartCount={cartCount} />

        {/* Page Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing setCartCount={setCartCount} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<MyOrders />} />


            {/* <Route path="/product/:id" element={<Products />} /> */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/orders/:id" element={<OrderDetails />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
