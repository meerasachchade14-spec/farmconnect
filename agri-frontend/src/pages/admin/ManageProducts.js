import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageProducts.css";

function ManageProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
      });
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        "http://127.0.0.1:8000/api/admin/product/delete/",
        {
          data: { id }   // ✅ backend expects id in body
        }
      );

      alert("Product Deleted");

      // UI update
      setProducts(prev => prev.filter(product => product.id !== id));

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Delete failed");
    }
  };

  return (
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

          {products.length === 0 ? (
            <tr>
              <td colSpan="3">No products found</td>
            </tr>
          ) : (
            products.slice(0, 10).map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>₹ {product.price}</td>
                <td>
                  <button
                    className="delete-product"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default ManageProducts;