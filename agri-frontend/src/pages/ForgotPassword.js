import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        const otpHint = data.otp ? ` OTP (dev): ${data.otp}` : "";
        setMessage(`${data.msg || "OTP sent."}${otpHint}`);
        setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password 🔑</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
