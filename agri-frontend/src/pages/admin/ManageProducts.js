import React,{useEffect,useState} from "react";
import axios from "axios";
import "./ManageProducts.css";

function ManageProducts(){

const [products,setProducts] = useState([]);

useEffect(()=>{

axios.get("http://127.0.0.1:8000/products/")
.then(res=>{
setProducts(res.data);
});

},[]);

const deleteProduct = async(id)=>{

await axios.delete("http://127.0.0.1:8000/admin/product/delete/",{
data:{id}
});

alert("Product Deleted");

}

return(

<div className="products-container">

<h2>All Products</h2>

<table className="products-table">

<thead>
<tr>
<th>Product</th>
<th>Price</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{products.map((product)=>(
<tr key={product.id}>

<td>{product.name}</td>
<td>₹ {product.price}</td>

<td>

<button
className="delete-product"
onClick={()=>deleteProduct(product.id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default ManageProducts;