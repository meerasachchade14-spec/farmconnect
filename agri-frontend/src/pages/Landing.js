import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./landing.css";
import crops from "../assests/crops.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const Landing = () => {
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
              {["Farmers", "Products", "Orders"].map((item, index) => (
                <motion.div
                  key={index}
                  className="admin-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <h3>{item}</h3>
                  <p>
                    {item === "Farmers"
                      ? "Verify & manage"
                      : item === "Products"
                      ? "Price & stock"
                      : "Track delivery"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FEATURE PREVIEW */}
          <div className="features-preview">
            {[
              { icon: "🌱", title: "Farmers First", desc: "Fair pricing & direct access" },
              { icon: "🥬", title: "Fresh Produce", desc: "Quality checked by admin" },
              { icon: "⭐", title: "Rated Quality", desc: "Trusted reviews" },
              { icon: "🚚", title: "Order Tracking", desc: "Live delivery updates" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <span>{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
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
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
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
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Contact Us</h2>
        <p>📧 farmconnect@gmail.com</p>
        <p>📞 +91 79840 59194</p>
        <p>📍 India</p>
      </motion.section>
    </>
  );
};

export default Landing;
