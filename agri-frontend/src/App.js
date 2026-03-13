import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

/* ---------------- Public Pages ---------------- */
import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Features from "./pages/Features";

/* ---------------- Farmer Pages ---------------- */
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import DashboardHomeFarmer from "./pages/farmer/DashboardHome";
import MyProduct from "./pages/farmer/MyProduct";
import Order from "./pages/farmer/Order";
import Earning from "./pages/farmer/Earning";
import AddProduct from "./pages/farmer/AddProduct";
import Profile from "./pages/farmer/Profile";

/* ---------------- Buyer Pages ---------------- */
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerTypeSelect from "./pages/buyer/BuyerTypeSelect";
import BrowseCrops from "./pages/buyer/BrowseCrops";
import MyOrders from "./pages/buyer/MyOrders";
import Wishlist from "./pages/buyer/Wishlist";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerHome from "./pages/buyer/BuyerHome";


/* ---------------- Admin Pages ---------------- */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHomeAdmin from "./pages/admin/DashboardHome";
import ManageFarmers from "./pages/admin/ManageFarmers";
import ManageBuyers from "./pages/admin/ManageBuyers";
import ManageProducts from "./pages/admin/ManageProducts";
import OrderAdmin from "./pages/admin/OrderAdmin";

/* ---------------- Splash Screen ---------------- */
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>

          {/* -------- Public Pages -------- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/features" element={<Features />} />

          {/* -------- Admin Login -------- */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* -------- Admin Dashboard -------- */}
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHomeAdmin />} />
            <Route path="farmers" element={<ManageFarmers />} />
            <Route path="buyers" element={<ManageBuyers />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<OrderAdmin />} />
          </Route>

          {/* -------- Farmer Routes -------- */}
          <Route path="/farmer-dashboard" element={<FarmerDashboard />}>
            <Route index element={<DashboardHomeFarmer />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="my-products" element={<MyProduct />} />
            <Route path="orders" element={<Order />} />
            <Route path="earnings" element={<Earning />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* -------- Buyer Routes -------- */}
          <Route path="/buyer-dashboard" element={<BuyerDashboard />}>
            <Route index element={<BuyerTypeSelect />} />
            <Route path="home" element={<BuyerHome />} />
            <Route path="browse" element={<BrowseCrops />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<BuyerProfile />} />
           
          </Route>

        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;