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
const [showLocationPrompt,setShowLocationPrompt] = useState(false);

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
 .catch(()=>{
  setLoading(false);
  setMessage("Failed to load profile");
 });

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

// ================= HANDLE INPUT =================

const handleChange = (e)=>{
 setProfile({
  ...profile,
  [e.target.name]:e.target.value
 });
};

// ================= SAVE PROFILE =================

const saveProfile = async () => {

  // REQUIRED COMMON FIELDS
  if (
    !profile.name.trim() ||
    !profile.phone.trim() ||
    !profile.address.trim() ||
    !profile.dob ||
    !profile.gender ||
    !profile.avatar_url.trim()
  ) {
    setMessage("Please fill all required fields");
    return;
  }

  // COMPANY REQUIRED FOR B2B
  if (
    buyerType === "B2B" &&
    !profile.company.trim()
  ) {
    setMessage("Company name is required");
    return;
  }

  try{

    const payload = {
      ...profile,
      buyer_type: buyerType
    };

    await axios.put(
      `http://127.0.0.1:8000/api/users/profile/${email}/update/`,
      payload
    );

    setMessage("Profile updated successfully");
    setEditMode(false);

  }catch(err){

    setMessage("Failed to update profile");
  }
};

// ================= LOCATION =================

const detectLocation = () => {

  setShowLocationPrompt(false);

  if (!navigator.geolocation) {
    setMessage("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    (pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      )
        .then(res => res.json())
        .then(json => {

          const place =
            json?.display_name ||
            `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

          const updated = {
            ...profile,
            address: place
          };

          setProfile(updated);

          return axios.put(
            `http://127.0.0.1:8000/api/users/profile/${email}/update/`,
            {
              address: place
            }
          );
        })
        .then(() => setMessage("Location updated"))
        .catch(() => setMessage("Failed to update location"));
    },

    () => setMessage("Location permission denied")
  );
};

// ================= PASSWORD =================

const changePassword = () => {

  navigate("/forgot-password", {
    state: { email }
  });
};

// ================= LOGOUT =================

const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("buyerType");
  localStorage.removeItem("name");
  localStorage.removeItem("phone");

  navigate("/login");
};

// ================= LOADING =================

if(loading){
 return (
  <div className="profile-page">
    Loading...
  </div>
 );
}

return(

<div className="profile-page">

<div className="profile-container">

{!email && (
<p className="status-msg">
Please login again to load your profile data.
</p>
)}

{/* LEFT PROFILE CARD */}

<div className="profile-left">

<div className="profile-card">

<img
src={profile.avatar_url || defaultBuyerImage}
alt="buyer"
className="profile-img"
/>

<h2>{profile.name || "Buyer"}</h2>

<p>{profile.email || email}</p>

<p>{profile.phone || "-"}</p>

{buyerType === "B2B" && (
<p>
<b>Company:</b> {profile.company || "-"}
</p>
)}

{message && (
<p className="status-msg">
{message}
</p>
)}

<button
className="edit-btn"
onClick={()=>setEditMode(!editMode)}
>

{editMode ? "Close Edit" : "Edit Profile"}

</button>

<div className="general-options">

<h4>General</h4>

<div
className="option"
onClick={() => setShowLocationPrompt(true)}
>
📍 Location
</div>

<div
className="option"
onClick={changePassword}
>
🔒 Change Password
</div>


<div
className="option"
onClick={logout}
>
🚪 Logout
</div>

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
placeholder="Full Name *"
required
/>

<input
type="text"
name="phone"
value={profile.phone}
onChange={handleChange}
placeholder="Phone Number *"
required
/>

<input
type="text"
name="address"
value={profile.address}
onChange={handleChange}
placeholder="Address *"
required
/>

{buyerType === "B2B" && (
<input
type="text"
name="company"
value={profile.company}
onChange={handleChange}
placeholder="Company Name *"
required
/>
)}

<input
type="text"
name="avatar_url"
value={profile.avatar_url}
onChange={handleChange}
placeholder="Profile Image URL *"
required
/>

<input
type="date"
name="dob"
value={profile.dob}
onChange={handleChange}
required
/>

<select
name="gender"
value={profile.gender}
onChange={handleChange}
required
>

<option value="">
Select Gender *
</option>

<option>
Male
</option>

<option>
Female
</option>

</select>

<button
className="save-btn"
onClick={saveProfile}
>
Save Profile
</button>

</div>

) : (

<div className="profile-widgets">

<div className="widget">

<h3>🛒 Buyer Information</h3>

{buyerType === "B2B" && (
<p>
<b>Company:</b> {profile.company || "-"}
</p>
)}

<p>
<b>Type:</b> {buyerType}
</p>

<p>
<b>Address:</b> {profile.address || "-"}
</p>

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

{cart.length === 0 ? (

<p>No items in cart</p>

) : (

cart.slice(0,5).map((c) => (

<p key={c.id}>
{c.product_name} (x{c.quantity})
</p>

))
)}

</div>

<div className="widget">

<h3>💖 Wishlist</h3>

{wishlist.length === 0 ? (

<p>No wishlist items</p>

) : (

wishlist.slice(0,5).map((w) => (

<p key={w.id}>
{w.product_name}
</p>

))
)}

</div>

</div>

)}

{/* LOCATION MODAL */}

{showLocationPrompt && (

<div className="location-overlay">

<div className="location-modal">

<h3>Enable Location</h3>

<p>
Allow location access just once for your current session.
</p>

<div className="location-actions">

<button
className="approve-btn"
onClick={detectLocation}
>
Enable once
</button>

<button
className="reject-btn"
onClick={() => setShowLocationPrompt(false)}
>
Not enable
</button>

</div>

</div>

</div>

)}

</div>

</div>

</div>

);

}

export default BuyerProfile;