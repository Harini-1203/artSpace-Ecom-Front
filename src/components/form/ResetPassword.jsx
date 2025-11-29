import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Abstract SVG Background */}
      <svg
        className="absolute top-10 left-10 w-40 h-40 opacity-20 text-blue-300"
        viewBox="0 0 200 200"
      >
        <path
          fill="currentColor"
          d="M40.3,-70.5C54.5,-63.2,69.5,-54.8,76.4,-41.3C83.3,-27.8,82.1,-9.3,75.4,5.8C68.6,21,56.3,32.8,45.3,45.2C34.2,57.5,24.3,70.4,10.4,77.2C-3.4,83.9,-21.4,84.5,-35.6,77.7C-49.8,70.9,-60.3,56.7,-68.1,42.1C-75.9,27.5,-80.9,12.7,-81.1,-2.7C-81.2,-18.2,-76.5,-34.3,-66.6,-45.5C-56.7,-56.6,-41.5,-62.9,-27.2,-70.4C-12.9,-77.8,0.6,-86.3,14.7,-87.4C28.9,-88.5,42.7,-82,40.3,-70.5Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        className="absolute bottom-10 right-10 w-52 h-52 opacity-25 text-blue-200 rotate-12"
        viewBox="0 0 200 200"
      >
        <path
          fill="currentColor"
          d="M51.8,-72.7C67.2,-63.3,79.7,-48.2,84.3,-31.4C88.8,-14.6,85.3,3.9,76.6,18.1C68,32.2,54.2,42.1,40.2,52.4C26.3,62.7,13.1,73.3,-0.4,73.8C-13.9,74.3,-27.8,64.6,-38.9,53.2C-49.9,41.9,-58.2,28.8,-65,13.9C-71.8,-1,-77.1,-17.7,-73.3,-32.3C-69.4,-46.9,-56.4,-59.5,-42.4,-69.5C-28.3,-79.5,-14.2,-86.9,1.7,-89.3C17.6,-91.8,35.3,-89.4,51.8,-72.7Z"
          transform="translate(100 100)"
        />
      </svg>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-[var(--brand-blue)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
