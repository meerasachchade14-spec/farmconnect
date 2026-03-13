import React from "react";
import { useLocation } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar(){

const location = useLocation();

return(

<div className="admin-navbar">

{/* Search example for products page */}

{location.pathname === "/admin-dashboard/products" && (

<input
type="text"
placeholder="Search products..."
className="search"
/>

)}

<div className="admin-user">

👨‍💼 Admin

</div>

</div>

)

}

export default AdminNavbar;