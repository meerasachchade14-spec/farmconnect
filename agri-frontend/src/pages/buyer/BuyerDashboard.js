import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import BuyerSidebar from "./BuyerSidebar";
import BuyerNavbar from "./BuyerNavbar";
import "./buyer.css";
import { useNavigate } from "react-router-dom";

function BuyerDashboard() {

const [buyerType,setBuyerType] = useState("");
const navigate = useNavigate();

useEffect(()=>{
 const type = localStorage.getItem("buyerType");
 setBuyerType(type);
},[]);

useEffect(() => {
  const handleUnload = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("buyerType");
    localStorage.removeItem("name");
    localStorage.removeItem("phone");
  };
  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [navigate]);

return (

<div className="buyer-layout">

<BuyerSidebar buyerType={buyerType} />

<div className="dashboard-section">

<BuyerNavbar buyerType={buyerType} />

<div className="dashboard-content">

<Outlet context={{buyerType}} />

</div>

</div>

</div>

);

}

export default BuyerDashboard;
