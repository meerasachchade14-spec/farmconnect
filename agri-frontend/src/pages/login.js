import React, { useState } from "react";
import axios from "axios";
import "../auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/login/",
        { email, password }
      );

      // role backend se aa raha hai
      if (res.data.role !== role) {
        setError("Role mismatch");
        return;
      }

      setError("");
      alert(`Login successful ✅ (${res.data.role})`);

      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 🌿</h2>
        <p>Login to your FarmConnect account</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <span className="auth-footer">
          New here? <a href="/register">Create an account</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
