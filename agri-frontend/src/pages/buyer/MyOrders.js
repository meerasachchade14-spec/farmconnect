import React,{useEffect,useState} from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders(){

const [orders,setOrders] = useState([]);

useEffect(()=>{

const email = localStorage.getItem("email");

axios.get(`http://127.0.0.1:8000/buyer/order/${email}/`)
.then(res=>{
setOrders(res.data);
});

},[]);

return(

<div className="orders">

<h2>My Orders</h2>

<div className="order-grid">

{orders.map((order)=>(
<div className="order-card" key={order.id}>

<h3>{order.product_name}</h3>

<p>Quantity: {order.quantity}</p>

<p>Status: {order.status}</p>

</div>
))}

</div>

</div>

)

}

export default MyOrders;