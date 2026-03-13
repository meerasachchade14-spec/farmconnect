import React, { useState } from "react";
import "./Profile.css";

/* Farmer Profile Image */
const farmerImage =
  "https://img.freepik.com/premium-photo/indian-farmer-standing-agriculture-field_75648-1795.jpg";

function Profile() {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "Jhanvi Farmer",
    email: "farmer@email.com",
    phone: "9876543210",
    address: "Ahmedabad, Gujarat",
    dob: "",
    gender: "",
    aadhar: "",
    bank: "",
    ifsc: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* LEFT PROFILE CARD */}
        <div className="profile-left">
          <div className="profile-card">
            <img src={farmerImage} alt="farmer" className="profile-img" />
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>{profile.phone}</p>

            <button
              className="edit-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Close Edit" : "Edit Profile"}
            </button>

            <div className="general-options">
              <h4>General</h4>
              <div className="option">📍 Location</div>
              <div className="option">🔒 Change Password</div>
              <div className="option">📦 My Orders</div>
              <div className="option">🌾 My Products</div>
              <div className="option">💰 Earnings</div>
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
              <input
                type="text"
                name="aadhar"
                value={profile.aadhar}
                onChange={handleChange}
                placeholder="Aadhar Number"
              />
              <input
                type="text"
                name="bank"
                value={profile.bank}
                onChange={handleChange}
                placeholder="Bank Account Number"
              />
              <input
                type="text"
                name="ifsc"
                value={profile.ifsc}
                onChange={handleChange}
                placeholder="IFSC Code"
              />
              <button className="save-btn">Save Profile</button>
            </div>
          ) : (
            <div className="profile-widgets">
              <div className="widget">
                <h3>🌾 Farm Information</h3>
                <p><b>Farm Type:</b> Organic Farming</p>
                <p><b>Main Crop:</b> Wheat</p>
                <p><b>Farm Size:</b> 3 Acres</p>
              </div>
              <div className="widget">
                <h3>📊 Account Status</h3>
                <p>Profile Verified</p>
                <p>Active Seller</p>
              </div>
              <div className="widget">
                <h3>📅 Member Since</h3>
                <p>January 2025</p>
              </div>
              <div className="widget">
                <h3>💳 Bank Details</h3>
                <p><b>Account:</b> {profile.bank || "Not Added"}</p>
                <p><b>IFSC:</b> {profile.ifsc || "Not Added"}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;