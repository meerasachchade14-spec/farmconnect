import React from "react";
import { useLocation } from "react-router-dom";
import "./BuyerNavbar.css";

function BuyerNavbar(){

const location = useLocation();

return(

<div className="navbar">

{/* Search bar only for Browse Crops page */}

{location.pathname === "/buyer-dashboard/browse" && (

<input
type="text"
placeholder="Search crops..."
className="search"
/>

)}

<div className="profile">
<span>Buyer</span>
</div>

</div>

)

}

export default BuyerNavbar;
