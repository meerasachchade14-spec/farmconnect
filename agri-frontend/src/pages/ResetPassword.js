import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../auth.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);

        // ✅ Auto login after reset
        localStorage.setItem("token", "sampletoken123"); // replace with real token
        setTimeout(() => navigate("/login"), 1000);

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
        <h2>Reset Password 🔄</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;