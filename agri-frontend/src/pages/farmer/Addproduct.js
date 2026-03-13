import React, {useState} from "react";
import axios from "axios";
import "./AddProduct.css";

function AddProduct(){

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [quantity,setQuantity] = useState("");

const handleSubmit = async (e)=>{
e.preventDefault();

const farmer_email = localStorage.getItem("email");

try{

await axios.post("http://127.0.0.1:8000/farmer/product/add/",{
name,
price,
quantity,
farmer_email
});

alert("Product Added Successfully");

}catch(err){
alert("Error adding product");
}

};

return(

<div className="add-product-page">

<h2 className="page-title">Add New Crop</h2>

<form className="add-product-form" onSubmit={handleSubmit}>

<div className="form-section">

<h3>Basic Details</h3>

<input
type="text"
placeholder="Crop Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
type="number"
placeholder="Price (₹ / kg)"
onChange={(e)=>setPrice(e.target.value)}
/>

<input
type="number"
placeholder="Quantity (kg)"
onChange={(e)=>setQuantity(e.target.value)}
/>

</div>

<button className="add-btn">
Add Product
</button>

</form>

</div>

)

}

export default AddProduct;