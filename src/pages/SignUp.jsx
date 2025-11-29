import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/form/AuthForm";
import { API_URL } from "../../config.js";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Join the Community"
      description="Sign up and start discovering beautiful art pieces ✨"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "name",
          label: "Full Name",
          type: "text",
          value: formData.name,
          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
          placeholder: "",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          value: formData.email,
          onChange: (e) => setFormData({ ...formData, email: e.target.value }),
          placeholder: "you@example.com",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          value: formData.password,
          onChange: (e) => setFormData({ ...formData, password: e.target.value }),
          placeholder: "",
        },
      ]}
      footerLinks={
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="underline cursor-pointer hover:text-gray-700 mx-auto block"
        >
          Already have an account? Log in
        </button>
      }
    />
  );
}
