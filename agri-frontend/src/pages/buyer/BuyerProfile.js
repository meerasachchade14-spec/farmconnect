import React, { useState, useEffect } from "react";
import "./BuyerProfile.css";

const buyerImage =
"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1709390585~exp=1709391185~hmac=7fa0a0fdaeb2e581fa32a22709bcf93e7cf116c451688f44e6d67844cd5a2c33";

function BuyerProfile(){

const [buyerType,setBuyerType] = useState("B2C");

useEffect(()=>{
 const type = localStorage.getItem("buyerType");
 if(type){
  setBuyerType(type);
 }
},[]);

const [editMode,setEditMode] = useState(false);

const [profile,setProfile] = useState({
 name: buyerType === "B2B" ? "Business Buyer" : "Retail Buyer",
 email: "buyer@email.com",
 phone: "9876543210",
 company: buyerType === "B2B" ? "ABC Traders" : "",
 address: "Ahmedabad, Gujarat",
 dob: "",
 gender: "",
});

const handleChange = (e)=>{
 setProfile({...profile,[e.target.name]:e.target.value});
};

return(

<div className="profile-page">

<div className="profile-container">

{/* LEFT PROFILE CARD */}

<div className="profile-left">

<div className="profile-card">

<img src={buyerImage} alt="buyer" className="profile-img"/>

<h2>{profile.name}</h2>

<p>{profile.email}</p>

<p>{profile.phone}</p>

{buyerType === "B2B" && <p><b>Company:</b> {profile.company}</p>}

<button
className="edit-btn"
onClick={()=>setEditMode(!editMode)}
>

{editMode ? "Close Edit" : "Edit Profile"}

</button>

<div className="general-options">

<h4>General</h4>

<div className="option">📍 Location</div>

<div className="option">🔒 Change Password</div>

<div className="option">🛒 My Orders</div>

<div className="option">💖 Wishlist</div>

{buyerType === "B2B" && <div className="option">📦 Bulk Orders</div>}

</div>

</div>

</div>

{/* RIGHT SIDE */}

<div className="profile-right">

{editMode ? (

<div className="edit-form">

<h3>Edit Profile</h3>

<input
type="text"
name="name"
value={profile.name}
onChange={handleChange}
placeholder="Full Name"
/>

<input
type="text"
name="phone"
value={profile.phone}
onChange={handleChange}
placeholder="Phone Number"
/>

{buyerType === "B2B" && (

<input
type="text"
name="company"
value={profile.company}
onChange={handleChange}
placeholder="Company Name"
/>

)}

<input
type="text"
name="address"
value={profile.address}
onChange={handleChange}
placeholder="Address"
/>

<input
type="date"
name="dob"
value={profile.dob}
onChange={handleChange}
/>

<select
name="gender"
value={profile.gender}
onChange={handleChange}
>

<option value="">Select Gender</option>

<option>Male</option>

<option>Female</option>

</select>

<button className="save-btn">Save Profile</button>

</div>

) : (

<div className="profile-widgets">

<div className="widget">

<h3>🛒 Buyer Information</h3>

{buyerType === "B2B" && <p><b>Company:</b> {profile.company}</p>}

<p><b>Type:</b> {buyerType}</p>

<p><b>Address:</b> {profile.address}</p>

</div>

<div className="widget">

<h3>📊 Account Status</h3>

<p>Profile Verified</p>

<p>Active Buyer</p>

</div>

<div className="widget">

<h3>📅 Member Since</h3>

<p>January 2025</p>

</div>

{buyerType === "B2B" && (

<div className="widget">

<h3>💼 Business Details</h3>

<p>Special Pricing Available</p>

<p>Bulk Order Enabled</p>

</div>

)}

</div>

)}

</div>

</div>

</div>

);

}

export default BuyerProfile;