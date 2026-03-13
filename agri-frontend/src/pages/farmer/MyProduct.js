import React,{useEffect,useState} from "react";
import axios from "axios";
import "./farmer.css";

function MyProduct(){

const [products,setProducts] = useState([]);

useEffect(()=>{

const email = localStorage.getItem("email");

axios.get(`http://127.0.0.1:8000/farmer/products/${email}/`)
.then(res=>{
setProducts(res.data);
});

},[]);

return(

<div className="main-content">

<h2>My Crops</h2>

<div className="product-grid">

{products.map((item)=>(
<div className="product-card" key={item.id}>

<h3>{item.name}</h3>

<p>₹ {item.price} /kg</p>

</div>
))}

</div>

</div>

)

}

export default MyProduct;