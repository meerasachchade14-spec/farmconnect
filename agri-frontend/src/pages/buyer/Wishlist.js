import React,{useEffect,useState} from "react";
import axios from "axios";
import "./Wishlist.css";

function Wishlist(){

const [items,setItems] = useState([]);

const email = localStorage.getItem("email");

useEffect(()=>{

axios.get(`http://127.0.0.1:8000/api/buyer/wishlist/${email}/`)
.then(res=>{
setItems(res.data);
});

},[]);

const removeItem = async(id)=>{

await axios.get(`http://127.0.0.1:8000/api/buyer/wishlist/remove/${id}/`);

setItems(items.filter((x)=>x.id !== id));
alert("Removed");

}

return(

<div className="wishlist">

<h2>My Wishlist</h2>

<div className="wishlist-grid">

{items.map((item)=>(
<div className="wishlist-card" key={item.id}>

<h3>{item.product_name}</h3>

<button
className="remove-btn"
onClick={()=>removeItem(item.id)}
>
Remove
</button>

</div>
))}

</div>

</div>

)

}

export default Wishlist;
