import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../auth.css";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, password, role } = location.state || {};

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);

        // ✅ Directly save token and go to dashboard
        localStorage.setItem("token", "sampletoken123"); // ya backend se real token
        setTimeout(() => navigate(`/${role}-dashboard`), 1000);

      } else {
        setMessage(data.error);
      }

    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP 📩</h2>
        <p>OTP sent to {email}</p>
        {message && <p>{message}</p>}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;