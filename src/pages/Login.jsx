import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/form/AuthForm";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      description="Log in to explore and manage your artworks 🎨"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          value: formData.email,
          onChange: (e) => setFormData({ ...formData, email: e.target.value }),
          placeholder: "",
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
        <>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="underline hover:text-gray-700"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="hover:text-gray-700"
          >
            Forgot password?
          </button>
        </>
      }
    />
  );
}
