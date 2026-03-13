import React from "react";
import "./DashboardHome.css";

function DashboardHome() {

const products = [
  { name: "Wheat", price: 25, image: "/images/wheat.jpg" },
  { name: "Rice", price: 30, image: "/images/rice.jpg" },
  { name: "Corn", price: 20, image: "/images/corn.jpg" },
  { name: "Cotton", price: 60, image: "/images/cotton.jpg" }
];

return (

<div>

{/* DASHBOARD CARDS */}

<div className="cards">

<div className="card">
<h3>Total Farmers</h3>
<p>120</p>
</div>

<div className="card">
<h3>Total Buyers</h3>
<p>85</p>
</div>

<div className="card">
<h3>Total Orders</h3>
<p>230</p>
</div>

</div>

{/* PRODUCTS SECTION */}

<div className="featured-section">

<h3>🌾 Recent Products</h3>

<div className="crop-grid">

{products.map((item,index)=>(
<div className="crop-card" key={index}>

<img src={item.image} alt={item.name}/>

<h4>{item.name}</h4>

<p>₹ {item.price} /kg</p>

</div>
))}

</div>

</div>

{/* MARKET INSIGHT */}

<div className="insight-box">

<h3>📊 Market Insight</h3>

<p>
Crop demand is increasing in the market.
Farmers selling wheat, rice and vegetables are getting better prices.
</p>

</div>

{/* ADMIN TIP */}

<div className="weather-box">

<h3>🛠 Admin Tip</h3>

<p>
Keep monitoring farmer activities and product listings to ensure
quality and fair pricing across the platform.
</p>

</div>

</div>

);

}

export default DashboardHome;