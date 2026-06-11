import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

function AddProduct() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [land, setLand] = useState("");
  const [soil, setSoil] = useState("");
  const [sand, setSand] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // ✅ REQUIRED VALIDATION

    if (
      !name ||
      !price ||
      !quantity ||
      !details ||
      !atmosphere ||
      !land ||
      !soil ||
      !sand ||
      !imageUrl
    ) {
      alert("Please fill all fields");
      return;
    }

    const farmer_email = localStorage.getItem("email");

    if (!farmer_email) {
      alert("Login required");
      return;
    }

    setLoading(true);

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/farmer/product/add/",
        {
          name: name.trim(),
          price: price.trim(),
          quantity: quantity.trim(),
          farmer_email,

          details: details.trim(),
          atmosphere: atmosphere.trim(),
          land: land.trim(),
          soil: soil.trim(),
          sand: sand.trim(),

          image_url: imageUrl.trim()
        }
      );

      alert("Product Added Successfully");

      // ✅ RESET FORM

      setName("");
      setPrice("");
      setQuantity("");
      setDetails("");
      setAtmosphere("");
      setLand("");
      setSoil("");
      setSand("");
      setImageUrl("");

    } catch (err) {

      alert(
        err?.response?.data?.error ||
        "Error adding product"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="add-product-page">

      <h2 className="page-title">
        Add New Crop
      </h2>

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >

        <div className="form-section">

          <h3>Basic Details</h3>

          <input
            type="text"
            placeholder="Crop Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price (₹ / kg) *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Quantity (kg) *"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <textarea
            placeholder="Crop Details *"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Atmosphere *"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Land Type *"
            value={land}
            onChange={(e) => setLand(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Soil Type *"
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Sand Type *"
            value={sand}
            onChange={(e) => setSand(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image URL *"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

        </div>

        <button
          className="add-btn"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>

    </div>
  );
}

export default AddProduct;