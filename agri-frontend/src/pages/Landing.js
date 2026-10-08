import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./landing.css";
import crops from "../assests/crops.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const Landing = () => {
  const [data, setData] = useState({
    farmers: { pending: 0, approved: 0, total: 0 },
    products: { total: 0, items: [] },
    stats: { farmers: 0, buyers: 0, products: 0, orders: 0 }
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/landing/overview/")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.nav>

      {/* HERO */}
      <section className="hero" id="home">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          Where Farms Meet the Future 🌾
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.3 }}
        >
          A smart digital marketplace for trusted agriculture
        </motion.p>
      </section>

      {/* MAIN SECTION */}
      <section className="main-section">

        {/* LEFT */}
        <motion.div
          className="left-panel"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="admin-preview">
            <h2>Admin Dashboard</h2>
            <p>Central control for the entire marketplace</p>

            <div className="admin-cards">
              <motion.div
                className="admin-card"
                whileHover={{ scale: 1.05 }}
              >
                <h3>Farmers</h3>
                <p>Pending: {data.farmers.pending}</p>
                <p>Approved: {data.farmers.approved}</p>
              </motion.div>
              <motion.div
                className="admin-card"
                whileHover={{ scale: 1.05 }}
              >
                <h3>Products</h3>
                <p>Available: {data.products.total}</p>
                <p>Price & stock</p>
              </motion.div>
            </div>

            <div className="product-mini-list">
              {data.products.items.length === 0 ? (
                <p>No products yet</p>
              ) : (
                data.products.items.map((item) => (
                  <div className="product-mini-item" key={item.id}>
                    <span className="product-name">{item.name}</span>
                    <span className="product-price">₹ {item.price}</span>
                    <span className="product-stock">Stock: {item.quantity ?? "-"}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEATURES */}
          <div className="features-preview">
            {[
              { icon: "🌱", title: "Farmers First", desc: `Total Farmers: ${data.stats.farmers}` },
              { icon: "🥬", title: "Fresh Produce", desc: `Total Products: ${data.stats.products}` },
              { icon: "⭐", title: "Rated Quality", desc: `Approved Farmers: ${data.farmers.approved}` },
              { icon: "🚚", title: "Order Tracking", desc: `Total Orders: ${data.stats.orders}` }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                whileHover={{ y: -5 }}
              >
                <span>{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="image-section"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.img
            src={crops}
            alt="Smart Farming"
          />

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/register" className="get-started">
              Get Started →
            </Link>
          </motion.div>
        </motion.div>

      </section>

      {/* CONTACT */}
      <motion.section
        className="contact"
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <h2>Contact Us</h2>
        
        <div className="contact-buttons">
          <a href="mailto:meera.ldrp.7@gmail.com" className="contact-btn">
            <span className="contact-icon">📧</span> meera.ldrp.7@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/meera-sachchade-208123395/" target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-icon">💼</span> Meet Me
          </a>
          <a href="https://www.linkedin.com/in/jhanvi-ramani-a15b123a8/" target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-icon">💼</span> Meet Jhanvi
          </a>
          <a href="https://github.com/meerasachchade14-spec" target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-icon">💻</span> Meera's Code
          </a>
          <a href="https://github.com/ramanijhanvi88" target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-icon">💻</span> Jhanvi's Code
          </a>
        </div>

        <p>📞 +91 79840 59194</p>
        <p>📍 Gandhinagar, Gujarat, India</p>
      </motion.section>

      {/* FOOTER WITH HIDDEN ADMIN LOGIN */}
      <footer className="footer">
        <p>© 2026 FarmConnect</p>
        <Link to="/admin-login" className="admin-link">Admin</Link>
      </footer>

    </>
  );
};

export default Landing;
