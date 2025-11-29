import axios from "axios";

axios.defaults.withCredentials = true;
import { API_URL } from "../config.js";

const API_BASE_URL = process.env.API_BASE_URL || API_URL;


export const getWishlist = () => axios.get(`${API_BASE_URL}/api/users/wishlist`);
export const toggleWishlist = (productId) =>
  axios.put(`${API_BASE_URL}/api/users/wishlist/${productId}`);
