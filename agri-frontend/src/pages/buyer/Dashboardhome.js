import React from "react";
import "./buyer.css";

function DashboardHome() {

const products = [
{
name:"Wheat",
price:25,
image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"
},
{
name:"Rice",
price:30,
image:"https://images.unsplash.com/photo-1586201375761-83865001e31c"
},
{
name:"Corn",
price:20,
image:"https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
},
{
name:"Cotton",
price:60,
image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea"
}
];

return(

<div>

{/* HERO BANNER */}

<div className="buyer-banner">

<h2>Buy Fresh Crops Directly From Farmers 🌾</h2>

<p>
Connect with verified farmers and purchase crops at the best price.
</p>

<button>Explore Crops</button>

</div>


{/* STATS */}

<div className="cards">

<div className="card">
<h3>Total Products</h3>
<p>120+</p>
</div>

<div className="card">
<h3>Farmers Connected</h3>
<p>80+</p>
</div>

<div className="card">
<h3>Orders Completed</h3>
<p>350+</p>
</div>

</div>


{/* FEATURED CROPS */}

<div className="featured-section">

<h3>Featured Crops</h3>

<div className="crop-grid">

{products.map((item,index)=>(

<div className="crop-card" key={index}>

<img src={item.image} alt={item.name}/>

<h4>{item.name}</h4>

<p>₹ {item.price} /kg</p>

<button className="buy-btn">View Details</button>

</div>

))}

</div>

</div>


{/* MARKET INSIGHT */}

<div className="insight-box">

<h3>Market Insights</h3>

<p>
Demand for organic wheat and rice is increasing this season.
Direct farmer-to-buyer trading helps reduce middleman costs
and ensures fresher products.
</p>

</div>


{/* BUYER BENEFITS */}

<div className="benefit-box">

<h3>Why Buy From FarmConnect?</h3>

<p>
✔ Direct connection with farmers <br/>
✔ Better bulk prices for B2B buyers <br/>
✔ Fresh organic crops <br/>
✔ Transparent marketplace
</p>

</div>

</div>

)

}

export default Dashboardhome;