import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";
import crops from "../assests/crops.jpg";

const Landing = () => {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">🌿 FarmConnect</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <Link to="/features">Features</Link>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn btn-outline">Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <h1>Where Farms Meet the Future 🌾</h1>
        <p>A smart digital marketplace for trusted agriculture</p>
      </section>

      {/* MAIN SECTION */}
      <section className="main-section">

        {/* LEFT */}
        <div className="left-panel">
          <div className="admin-preview">
            <h2>Admin Dashboard</h2>
            <p>Central control for the entire marketplace</p>

            <div className="admin-cards">
              <div className="admin-card">
                <h3>Farmers</h3>
                <p>Verify & manage</p>
              </div>
              <div className="admin-card">
                <h3>Products</h3>
                <p>Price & stock</p>
              </div>
              <div className="admin-card">
                <h3>Orders</h3>
                <p>Track delivery</p>
              </div>
            </div>
          </div>

          {/* FEATURE PREVIEW */}
          <div className="features-preview">
            <div className="feature-card">
              <span>🌱</span>
              <h4>Farmers First</h4>
              <p>Fair pricing & direct access</p>
            </div>

            <div className="feature-card">
              <span>🥬</span>
              <h4>Fresh Produce</h4>
              <p>Quality checked by admin</p>
            </div>

            <div className="feature-card">
              <span>⭐</span>
              <h4>Rated Quality</h4>
              <p>Trusted reviews</p>
            </div>

            <div className="feature-card">
              <span>🚚</span>
              <h4>Order Tracking</h4>
              <p>Live delivery updates</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="image-section">
          <img src={crops} alt="Smart Farming" />
          <Link to="/register" className="get-started">
            Get Started →
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>📧 farmconnect@gmail.com</p>
        <p>📞 +91 79840 59194</p>
        <p>📍 India</p>
      </section>
    </>
  );
};

export default Landing;
