import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";


export const getWishlist = () => axios.get(`${API_BASE_URL}/api/users/wishlist`);
export const toggleWishlist = (productId) =>
  axios.put(`${API_BASE_URL}/api/users/wishlist/${productId}`);
