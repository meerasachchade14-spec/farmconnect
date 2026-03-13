import React, { useState } from "react";
import axios from "axios";
import { adminLogin } from "../services/adminAuth";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    if(!email || !password){
      setError("All fields are required");
      return;
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          email: email,
          password: password
        }
      );

      if (res.data?.role !== "admin") {
        setError("Not an admin account");
        return;
      }

      if (res.data?.token) {
        adminLogin(res.data.token);
      } else {
        adminLogin("admin-session");
      }

      navigate("/admin-dashboard");

    } 
    catch (error) {

      setError("Invalid Admin Credentials");

    }

  };

  return (

    <div className="auth-container">

      <form className="auth-card" onSubmit={handleLogin}>

        <h2>Admin Login 👨‍💼</h2>
        <p>Login to Admin Panel</p>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
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
