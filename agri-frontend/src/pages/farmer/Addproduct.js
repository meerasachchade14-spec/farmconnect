import React from "react";
import "./AddProduct.css";
const AddProduct = () => {
  return (
    <div>
      <h2>Add Product</h2>
      <input placeholder="Product Name" />
      <input placeholder="Price" />
      <input placeholder="Quantity" />
      <button>Add Product</button>
    </div>
  );
};

export default AddProduct;