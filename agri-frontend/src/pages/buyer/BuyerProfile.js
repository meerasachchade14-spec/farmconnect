import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BuyerProfile.css";

const defaultBuyerImage =
"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1709390585~exp=1709391185~hmac=7fa0a0fdaeb2e581fa32a22709bcf93e7cf116c451688f44e6d67844cd5a2c33";

function BuyerProfile(){

const [buyerType,setBuyerType] = useState("B2C");
const [editMode,setEditMode] = useState(false);
const [loading,setLoading] = useState(true);
const [message,setMessage] = useState("");
const [cart,setCart] = useState([]);
const [wishlist,setWishlist] = useState([]);

const [profile,setProfile] = useState({
 name: "",
 email: "",
 phone: "",
 company: "",
 address: "",
 dob: "",
 gender: "",
 avatar_url: "",
 buyer_type: ""
});

const email = localStorage.getItem("email");
const navigate = useNavigate();

useEffect(()=>{
 const type = localStorage.getItem("buyerType");
 if(type){
  setBuyerType(type);
 }
},[]);

useEffect(()=>{
 if(!email){
  setLoading(false);
  return;
 }
 axios.get(`http://127.0.0.1:8000/api/users/profile/${email}/`)
 .then(res=>{
  setProfile(res.data);
  setLoading(false);
 })
 .catch(()=>setLoading(false));
},[email]);

useEffect(()=>{
 if(!email) return;
 axios.get(`http://127.0.0.1:8000/api/buyer/cart/${email}/`)
 .then(res=>setCart(res.data || []))
 .catch(()=>setCart([]));

 axios.get(`http://127.0.0.1:8000/api/buyer/wishlist/${email}/`)
 .then(res=>setWishlist(res.data || []))
 .catch(()=>setWishlist([]));
},[email]);

const handleChange = (e)=>{
 setProfile({...profile,[e.target.name]:e.target.value});
};

const saveProfile = async () => {
 try{
  const payload = {
    ...profile,
    buyer_type: buyerType
  };
  await axios.put(`http://127.0.0.1:8000/api/users/profile/${email}/update/`, payload);
  setMessage("Profile updated");
  setEditMode(false);
 }catch(err){
  setMessage("Failed to update profile");
 }
};

const detectLocation = () => {
  if (!navigator.geolocation) {
    setMessage("Geolocation is not supported");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      const updated = { ...profile, address: coords };
      setProfile(updated);
      axios.put(`http://127.0.0.1:8000/api/users/profile/${email}/update/`, {
        address: coords
      }).then(() => setMessage("Location updated")).catch(() => setMessage("Failed to update location"));
    },
    () => setMessage("Location permission denied")
  );
};

const changePassword = () => {
  navigate("/forgot-password", { state: { email } });
};

if(loading){
 return <div className="profile-page">Loading...</div>;
}

return(

<div className="profile-page">

<div className="profile-container">

{/* LEFT PROFILE CARD */}

<div className="profile-left">

<div className="profile-card">

<img src={profile.avatar_url || defaultBuyerImage} alt="buyer" className="profile-img"/>

<h2>{profile.name || "Buyer"}</h2>

<p>{profile.email || email}</p>

<p>{profile.phone || "-"}</p>

{buyerType === "B2B" && <p><b>Company:</b> {profile.company || "-"}</p>}
{message && <p className="status-msg">{message}</p>}

<button
className="edit-btn"
onClick={()=>setEditMode(!editMode)}
>

{editMode ? "Close Edit" : "Edit Profile"}

</button>

<div className="general-options">

<h4>General</h4>

<div className="option" onClick={detectLocation}>📍 Location</div>

<div className="option" onClick={changePassword}>🔒 Change Password</div>

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

<button className="save-btn" onClick={saveProfile}>Save Profile</button>

</div>

) : (

<div className="profile-widgets">

<div className="widget">

<h3>🛒 Buyer Information</h3>

{buyerType === "B2B" && <p><b>Company:</b> {profile.company || "-"}</p>}

<p><b>Type:</b> {buyerType}</p>

<p><b>Address:</b> {profile.address || "-"}</p>

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

<div className="widget">
<h3>🛒 Cart Items</h3>
{cart.length === 0 ? <p>No items in cart</p> : (
  cart.slice(0,5).map((c) => (
    <p key={c.id}>{c.product_name} (x{c.quantity})</p>
  ))
)}
</div>

<div className="widget">
<h3>💖 Wishlist</h3>
{wishlist.length === 0 ? <p>No wishlist items</p> : (
  wishlist.slice(0,5).map((w) => (
    <p key={w.id}>{w.product_name}</p>
  ))
)}
</div>

</div>

)}

</div>

</div>

</div>

);

}

export default BuyerProfile;
