import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../auth.css";

const Login = () => {
  const navigate = useNavigate();

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

      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      const backendRole = data.role;
      if (backendRole !== role) {
        setError("Role mismatch");
        return;
      }

      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setError("");
      navigate(`/${backendRole}-dashboard`);

    } catch (err) {
      setError("Server error");
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
            <option value="">Login As</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <span className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
