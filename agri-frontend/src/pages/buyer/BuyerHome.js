import React from "react";
import "./buyer.css";

function BuyerHome() {

const products = [
  { name:"Wheat", price:25, image:"/images/wheat.jpg" },
  { name:"Rice", price:30, image:"/images/rice.jpg" },
  { name:"Cotton", price:60, image:"/images/cotton.jpg" }
];

return (

<div>

{/* DASHBOARD CARDS */}

<div className="cards">

<div className="card">
<h3>Available Products</h3>
<p>{products.length}</p>
</div>

<div className="card">
<h3>Total Orders</h3>
<p>12</p>
</div>

<div className="card">
<h3>Saved Farmers</h3>
<p>6</p>
</div>

</div>


{/* FEATURED PRODUCTS */}

<div className="featured-section">

<h3>🌾 Featured Crops</h3>

<div className="crop-grid">

{products.map((item,index)=>(
<div className="crop-card" key={index}>

<img src={item.image} alt={item.name}/>

<h4>{item.name}</h4>

<p>₹ {item.price} /kg</p>

<button className="buy-btn">View Product</button>

</div>
))}

</div>

</div>


{/* MARKET NEWS */}

<div className="insight-box">

<h3>📊 Market Trends</h3>

<p>
Agriculture demand is increasing for organic wheat and rice.
Bulk buyers (B2B) are getting better prices this season.
</p>

</div>


{/* BUYER TIP */}

<div className="weather-box">

<h3>💡 Buyer Tip</h3>

<p>
Buying directly from farmers reduces cost and ensures fresh products.
Bulk orders can get up to 20% discount.
</p>

</div>

</div>

);

}

export default BuyerHome;