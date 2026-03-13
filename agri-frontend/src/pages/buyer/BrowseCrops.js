import React,{useEffect,useState} from "react";
import axios from "axios";
import "./BrowseCrops.css";

function BrowseCrops(){

const [crops,setCrops] = useState([]);

useEffect(()=>{

axios.get("http://127.0.0.1:8000/products/")
.then(res=>{
setCrops(res.data);
});

},[]);

const addToCart = async(item)=>{

const email = localStorage.getItem("email");

await axios.post("http://127.0.0.1:8000/buyer/cart/add/",{
buyer_email:email,
product_name:item.name,
quantity:1
});

alert("Added to cart");

}

return(

<div>

<h2>Browse Crops</h2>

<div className="crop-grid">

{crops.map((item)=>(
<div className="crop-card" key={item.id}>

<h3>{item.name}</h3>

<p>₹ {item.price}/kg</p>

<button
className="cart-btn"
onClick={()=>addToCart(item)}
>
Add To Cart
</button>

</div>
))}

</div>

</div>

)

}

export default BrowseCrops;