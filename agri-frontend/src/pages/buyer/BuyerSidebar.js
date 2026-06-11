import React from "react";
import { Link } from "react-router-dom";
import "./BuyerSidebar.css";

function BuyerSidebar() {

  return (

    <div className="sidebar">

      <h2 className="sidebar-logo">
        Buyer
      </h2>

      <ul>

        <li>
          <Link to="/buyer-dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/buyer-dashboard/browse">
            Browse Crops
          </Link>
        </li>

        <li>
          <Link to="/buyer-dashboard/orders">
            My Cart
          </Link>
        </li>

        <li>
          <Link to="/buyer-dashboard/wishlist">
            Wishlist
          </Link>
        </li>

        <li>
          <Link to="/buyer-dashboard/payment">
            Payment
          </Link>
        </li>

        <li>
          <Link to="/buyer-dashboard/profile">
            Profile
          </Link>
        </li>

      </ul>

    </div>

  );

}

export default BuyerSidebar;