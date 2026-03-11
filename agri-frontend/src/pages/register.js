import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, role, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {

      const res = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Redirect to OTP verification page
        navigate("/verify-otp", {
          state: { email, password, role }
        });
      } else {
        setMessage(data.error);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🌾</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <select name="role" onChange={handleChange}>
            <option value="">Register As</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;