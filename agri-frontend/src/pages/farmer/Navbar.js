import React from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar(){

const location = useLocation();

return(

<div className="navbar">

{/* Search only in My Products page */}

{location.pathname === "/farmer-dashboard/products" && (

<input
type="text"
placeholder="Search products..."
className="search"
/>

)}

<div className="user">
👨‍🌾 Farmer
</div>

</div>

)

}

export default Navbar;