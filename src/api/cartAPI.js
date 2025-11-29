import axios from "axios";

axios.defaults.withCredentials = true;
import { API_URL } from "../../config.js";

const API_BASE_URL = API_URL;
export const getCart = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // optional if cookies are used
  });

  if (!res.ok) {
    throw new Error(`Error fetching cart: ${res.status}`);
  }

  return res.json();
};
export const addToCart = async (productId, qty = 1) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/api/cart/add/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ productId, qty }),
  });

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }

  return res.json();
};


// 🛒 Update cart item quantity
export const updateCartItem = async (productId, qty) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API_BASE_URL}/api/cart/update/${productId}`,
    { qty },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

// ❌ Remove item from cart
export const removeCartItem = async (productId) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

