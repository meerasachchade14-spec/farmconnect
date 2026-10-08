import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    // VALIDATION

    if (!email || !password) {

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

      if (res.ok) {
        if (data.role === "admin") {
          localStorage.setItem("email", data.email);
          localStorage.setItem("role", "admin");
          localStorage.setItem("admin", true);
          navigate("/admin-dashboard");
        } else {
          setError("Access Denied: Not an admin account");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }

  };

  return (

    <div className="auth-container">

      <form className="auth-card" onSubmit={handleLogin}>

        <h2>Admin Login 👨‍💼</h2>

        <p>Login to Admin Panel</p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

};

export default AdminLogin;