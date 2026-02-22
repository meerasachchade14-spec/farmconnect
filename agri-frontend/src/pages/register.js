import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const Register = () => {
  const navigate = useNavigate();   // ✅ ADD THIS

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, role, password, confirmPassword } = formData;

    if (!name || !email || !phone || !role || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/register/",
        {
          name,
          email,
          phone,
          role,
          password,
        }
      );

      setError("");
      setSuccess("Registration successful 🌱");

      console.log(res.data);

      // ✅ REDIRECT LOGIC
      if (role === "farmer") {
        navigate("/farmer-dashboard");
      } else if (role === "buyer") {
        navigate("/");  // ya buyer dashboard ka route
      }

    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🌾</h2>
        <p>Join the FarmConnect marketplace</p>

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Register As</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />

          <button type="submit">Register</button>
        </form>

        <span className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </span>
      </div>
    </div>
  );
};

export default Register;