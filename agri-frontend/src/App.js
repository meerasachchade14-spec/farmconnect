import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Features from "./pages/features";
import SplashScreen from "./pages/SplashScreen";

/* ---------------- Farmer Pages ---------------- */
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import MyProduct from "./pages/farmer/MyProduct";
import Order from "./pages/farmer/Order";
import Earning from "./pages/farmer/Earning";
import AddProduct from "./pages/farmer/Addproduct";
import Profile from "./pages/farmer/Profile";

/* ---------------- Buyer Pages ---------------- */
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BrowseCrops from "./pages/buyer/BrowseCrops";
import MyOrders from "./pages/buyer/MyOrders";
import Wishlist from "./pages/buyer/Wishlist";
import BuyerProfile from "./pages/buyer/BuyerProfile";

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

            {/* -------- Public Pages -------- */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />

            {/* -------- Farmer Routes -------- */}
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/my-products" element={<MyProduct />} />
            <Route path="/farmer/orders" element={<Order />} />
            <Route path="/farmer/earnings" element={<Earning />} />
            <Route path="/farmer/add-product" element={<AddProduct />} />
            <Route path="/farmer/profile" element={<Profile />} />

            {/* -------- Buyer Routes -------- */}
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/browse" element={<BrowseCrops />} />
            <Route path="/buyer/orders" element={<MyOrders />} />
            <Route path="/buyer/wishlist" element={<Wishlist />} />
            <Route path="/buyer/profile" element={<BuyerProfile />} />

          </Routes>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}

export default App;