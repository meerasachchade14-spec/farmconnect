import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import BuyerSidebar from "./BuyerSidebar";
import BuyerNavbar from "./BuyerNavbar";
import "./buyer.css";

function BuyerDashboard() {

const [buyerType,setBuyerType] = useState("");

useEffect(()=>{
 const type = localStorage.getItem("buyerType");
 setBuyerType(type);
},[]);

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