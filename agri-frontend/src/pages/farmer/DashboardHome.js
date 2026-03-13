import React from "react";
import "./farmer.css";

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
<h3>Total Products</h3>
<p>{products.length}</p>
</div>

<div className="card">
<h3>Total Orders</h3>
<p>8</p>
</div>

<div className="card">
<h3>Total Earnings</h3>
<p>₹24,000</p>
</div>

</div>

{/* CROPS DISPLAY FROM MYPRODUCT */}

<div className="featured-section">

<h3>🌾 Your Crops</h3>

<div className="crop-grid">

{products.slice(0,4).map((item,index)=>(
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
Organic crops demand is increasing this season.
Farmers selling wheat and vegetables are getting higher prices.
</p>

</div>

{/* PREMIUM FEATURE */}

<div className="weather-box">

<h3>🌦 Farmer Tip</h3>

<p>
Best time to water crops is early morning or evening.
This helps reduce evaporation and improves crop growth.
</p>

</div>

</div>

);

}

export default DashboardHome;