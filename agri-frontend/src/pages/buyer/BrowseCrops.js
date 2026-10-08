import React,{useEffect,useState} from "react";
import axios from "axios";
import "./BrowseCrops.css";

function BrowseCrops(){

const [crops,setCrops] = useState([]);

const defaultImage = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6";

const staticCrops = [
  {
    name: "Wheat",
    price: 28,
    image: "https://images.unsplash.com/photo-1501430654243-c934cec2e1c0",
    land: "Loamy plains",
    atmosphere: "Cool & dry",
    soil: "Loamy soil",
    details: "High-protein grain for daily staples",
    farmer_email: "meerasachchade14@gmail.com"
  },
  {
    name: "Rice",
    price: 32,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    land: "Irrigated fields",
    atmosphere: "Warm & humid",
    soil: "Clayey soil",
    details: "Polished grains, good for bulk orders",
    farmer_email: "meerasachchade14@gmail.com"
  },
  {
    name: "Cotton",
    price: 60,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    land: "Dry land",
    atmosphere: "Hot & dry",
    soil: "Black soil",
    details: "Fiber crop for textile production",
    farmer_email: "meerasachchade14@gmail.com"
  }
];

useEffect(()=>{

axios.get("http://127.0.0.1:8000/api/products/")
.then(res=>{
setCrops(res.data || []);
});

},[]);

const addToCart = async(item)=>{

const email = localStorage.getItem("email");
if(!email){
  alert("Please login first");
  return;
}

await axios.post("http://127.0.0.1:8000/api/buyer/cart/add/",{
    buyer_email: email,
    product_name: item.name,
    quantity: 1,
    price: item.price,
    farmer_email: item.farmer_email || ""
});

alert("Added to cart");

}

const addToWishlist = async(item)=>{
const email = localStorage.getItem("email");
if(!email){
  alert("Please login first");
  return;
}
await axios.post("http://127.0.0.1:8000/api/buyer/wishlist/add/",{
buyer_email:email,
product_name:item.name
});
alert("Added to wishlist");
}

return(

<div>

<h2>Browse Crops</h2>

<div className="crop-grid">

{[...staticCrops, ...crops].map((item, idx)=>(
<div className="crop-card" key={item.id || `${item.name}-${idx}`}>

<img src={item.image_url || item.image || defaultImage} alt={item.name} className="crop-img" />

<h3>{item.name}</h3>

<p>₹ {item.price}/kg</p>

<div className="crop-details">
  <p><b>Land:</b> {item.land || "Available farmland"}</p>
  <p><b>Atmosphere:</b> {item.atmosphere || "Moderate"}</p>
  <p><b>Soil:</b> {item.soil || item.sand || "Loamy"}</p>
  <p><b>Details:</b> {item.details || "Fresh crop ready for market"}</p>
</div>

<button
className="cart-btn"
onClick={()=>addToCart(item)}
>
Add To Cart
</button>

<button
className="cart-btn"
onClick={()=>addToWishlist(item)}
>
Add to Wishlist
</button>

</div>
))}

</div>

</div>

)

}

export default BrowseCrops;
