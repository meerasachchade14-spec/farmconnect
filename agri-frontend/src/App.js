import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Features from "./pages/features";
import SplashScreen from "./pages/SplashScreen";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import MyProduct from "./pages/farmer/MyProduct";
import Order from "./pages/farmer/Order";
import Earning from "./pages/farmer/Earning";
import AddProduct from "./pages/farmer/Addproduct";
import Profile from "./pages/farmer/Profile";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SplashScreen />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />

            {/* Farmer Pages */}
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/my-products" element={<MyProduct />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/earnings" element={<Earning />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}

export default App;