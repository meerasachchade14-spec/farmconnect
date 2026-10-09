import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardHome.css";
import "./OrderAdmin.css";

function DashboardHome() {

const [counts, setCounts] = useState({
  Farmers: 0,
  Buyers: 0,
  Orders: 0,
  Products: 0
});
const [recentOrders, setRecentOrders] = useState([]);
const [cartItems, setCartItems] = useState([]);
const [wishlistItems, setWishlistItems] = useState([]);

useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/admin/overview/")
  .then(res => {
    setCounts(res.data.counts || counts);
    setRecentOrders(res.data.recent_orders || []);
  })
  .catch(() => {
    setCounts(counts);
    setRecentOrders([]);
  });

  axios.get("http://127.0.0.1:8000/api/admin/cart/")
  .then(res => setCartItems(res.data || []))
  .catch(() => setCartItems([]));

  axios.get("http://127.0.0.1:8000/api/admin/wishlist/")
  .then(res => setWishlistItems(res.data || []))
  .catch(() => setWishlistItems([]));
}, []);

return (

<div>

{/* DASHBOARD CARDS */}

<div className="cards">

<div className="card">
<h3>Total Farmers</h3>
<p>{counts.Farmers}</p>
</div>

<div className="card">
<h3>Total Buyers</h3>
<p>{counts.Buyers}</p>
</div>

<div className="card">
<h3>Total Orders</h3>
<p>{counts.Orders}</p>
</div>

<div className="card">
<h3>Total Products</h3>
<p>{counts.Products}</p>
</div>

</div>

{/* RECENT ORDERS */}

<div className="orders-container">
<h2>Recent Orders</h2>

<table className="orders-table">
<thead>
  <tr>
    <th>Order ID</th>
    <th>Buyer</th>
    <th>Farmer</th>
    <th>Product</th>
    <th>Quantity</th>
    <th>Status</th>
  </tr>
</thead>
<tbody>
  {recentOrders.length === 0 ? (
    <tr>
      <td colSpan="6">No recent orders</td>
    </tr>
  ) : (
    recentOrders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.buyer_email || "-"}</td>
        <td>{order.farmer_email || "-"}</td>
        <td>{order.product_name || "-"}</td>
        <td>{order.quantity || "-"}</td>
        <td>{order.status || "-"}</td>
      </tr>
    ))
  )}
</tbody>
</table>
</div>

<div className="orders-container">
<h2>Recent Cart Items</h2>

<table className="orders-table">
<thead>
  <tr>
    <th>Buyer</th>
    <th>Product</th>
    <th>Quantity</th>
  </tr>
</thead>
<tbody>
  {cartItems.length === 0 ? (
    <tr>
      <td colSpan="3">No cart items</td>
    </tr>
  ) : (
    cartItems.map((item) => (
      <tr key={item.id}>
        <td>{item.buyer_email || "-"}</td>
        <td>{item.product_name || "-"}</td>
        <td>{item.quantity || "-"}</td>
      </tr>
    ))
  )}
</tbody>
</table>
</div>

<div className="orders-container">
<h2>My Wishlist Items</h2>

<table className="orders-table">
<thead>
  <tr>
    <th>Buyer</th>
    <th>Product</th>
  </tr>
</thead>
<tbody>
  {wishlistItems.length === 0 ? (
    <tr>
      <td colSpan="2">No wishlist items</td>
    </tr>
  ) : (
    wishlistItems.map((item) => (
      <tr key={item.id}>
        <td>{item.buyer_email || "-"}</td>
        <td>{item.product_name || "-"}</td>
      </tr>
    ))
  )}
</tbody>
</table>
</div>

</div>

);

}

export default DashboardHome;
