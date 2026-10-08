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
  const [imageFile, setImageFile] = useState(null);

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
      !imageFile
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

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price.trim());
      formData.append("quantity", quantity.trim());
      formData.append("farmer_email", farmer_email);
      formData.append("details", details.trim());
      formData.append("atmosphere", atmosphere.trim());
      formData.append("land", land.trim());
      formData.append("soil", soil.trim());
      formData.append("sand", sand.trim());
      formData.append("image", imageFile);

      await axios.post(
        "http://127.0.0.1:8000/api/farmer/product/add/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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
      setImageFile(null);
      
      // Reset file input element visually
      document.getElementById("image-upload-input").value = "";

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
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
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