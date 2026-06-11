import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const defaultFarmerImage =
  "https://img.freepik.com/premium-photo/indian-farmer-standing-agriculture-field_75648-1795.jpg";

function Profile() {

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    aadhar: "",
    avatar_url: "",

    farm_type: "",
    main_crop: "",
    farm_size: "",

    member_since: "",
    location_enabled: false
  });

  // ================= LOAD PROFILE =================

  useEffect(() => {

    if (!email) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/users/profile/${email}/`)
      .then((res) => {

        setProfile({
          ...profile,
          ...res.data
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage("Failed to load profile");
      });

  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // ================= SAVE PROFILE =================

  const saveProfile = async () => {

    // CHECK ALL COMMON FIELDS
    if (
      !profile.name.trim() ||
      !profile.phone.trim() ||
      !profile.address.trim() ||
      !profile.dob ||
      !profile.gender ||
      !profile.aadhar.trim() ||
      !profile.avatar_url.trim()
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    // FARMER REQUIRED
    if (
      role === "farmer" &&
      (
        !profile.farm_type.trim() ||
        !profile.main_crop.trim() ||
        !profile.farm_size.trim()
      )
    ) {
      setMessage("Please fill all farm details");
      return;
    }

    try {

      const payload = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        dob: profile.dob,
        gender: profile.gender,
        aadhar: profile.aadhar,
        avatar_url: profile.avatar_url,
        location_enabled: profile.location_enabled
      };

      // ONLY FOR FARMER
      if (role === "farmer") {

        payload.farm_type = profile.farm_type;
        payload.main_crop = profile.main_crop;
        payload.farm_size = profile.farm_size;
      }

      await axios.put(
        `http://127.0.0.1:8000/api/users/profile/${email}/update/`,
        payload
      );

      setMessage("Profile updated successfully");
      setEditMode(false);

    } catch (err) {

      setMessage(
        err?.response?.data?.error || "Failed to update profile"
      );
    }
  };

  // ================= LOCATION =================

  const detectLocation = () => {

    setShowLocationPrompt(false);

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        )
          .then((res) => res.json())
          .then(async (json) => {

            const place =
              json?.display_name ||
              `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

            const updatedProfile = {
              ...profile,
              address: place,
              location_enabled: true
            };

            setProfile(updatedProfile);

            await axios.put(
              `http://127.0.0.1:8000/api/users/profile/${email}/update/`,
              updatedProfile
            );

            setMessage("Location enabled");
          })
          .catch(() => {
            setMessage("Failed to update location");
          });
      },

      () => {
        setMessage("Location permission denied");
      }
    );
  };

  // ================= DISABLE LOCATION =================

  const disableLocation = async () => {

    try {

      const updatedProfile = {
        ...profile,
        location_enabled: false
      };

      setProfile(updatedProfile);

      await axios.put(
        `http://127.0.0.1:8000/api/users/profile/${email}/update/`,
        updatedProfile
      );

      setMessage("Location disabled");

    } catch {

      setMessage("Failed to disable location");
    }
  };

  // ================= PASSWORD =================

  const changePassword = () => {

    navigate("/forgot-password", {
      state: { email }
    });
  };

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    navigate("/login");
  };

  // ================= DATE FORMAT =================

  const formatDate = (dateStr) => {

    if (!dateStr) return "N/A";

    return dateStr;
  };

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="profile-page">
        Loading...
      </div>
    );
  }

  return (

    <div className="profile-page">

      <div className="profile-container">

        {/* LEFT */}

        <div className="profile-left">

          <div className="profile-card">

            <img
              src={profile.avatar_url || defaultFarmerImage}
              alt="profile"
              className="profile-img"
            />

            <h2>{profile.name || "User"}</h2>

            <p>{profile.email || email}</p>

            <p>{profile.phone || "-"}</p>

            {/* MEMBER SINCE */}

            <p>
              <b>Member Since:</b>{" "}
              {formatDate(profile.member_since)}
            </p>

            {/* STATUS */}

            <p>
              <b>Status:</b>{" "}
              {profile.status || "Pending"}
            </p>

            {message && (
              <p className="status-msg">
                {message}
              </p>
            )}

            <button
              className="edit-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Close Edit" : "Edit Profile"}
            </button>

            {/* GENERAL OPTIONS */}

            <div className="general-options">

              <h4>General</h4>

              {/* LOCATION */}

              {!profile.location_enabled ? (

                <div
                  className="option"
                  style={{
                    background: "green",
                    color: "white"
                  }}
                  onClick={() => setShowLocationPrompt(true)}
                >
                  📍 Enable Location
                </div>

              ) : (

                <div
                  className="option"
                  style={{
                    background: "red",
                    color: "white"
                  }}
                  onClick={disableLocation}
                >
                  📍 Disable Location
                </div>
              )}

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

        {/* RIGHT */}

        <div className="profile-right">

          {editMode ? (

            <div className="edit-form">

              <h3>Edit Profile</h3>

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Full Name *"
                required
              />

              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Phone *"
                required
              />

              <input
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Address *"
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

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>

              <input
                name="aadhar"
                value={profile.aadhar}
                onChange={handleChange}
                placeholder="Aadhar *"
                required
              />

              <input
                name="avatar_url"
                value={profile.avatar_url}
                onChange={handleChange}
                placeholder="Profile Image URL *"
                required
              />

              {/* FARMER ONLY */}

              {role === "farmer" && (
                <>
                  <input
                    name="farm_type"
                    value={profile.farm_type}
                    onChange={handleChange}
                    placeholder="Farm Type *"
                    required
                  />

                  <input
                    name="main_crop"
                    value={profile.main_crop}
                    onChange={handleChange}
                    placeholder="Main Crop *"
                    required
                  />

                  <input
                    name="farm_size"
                    value={profile.farm_size}
                    onChange={handleChange}
                    placeholder="Farm Size *"
                    required
                  />
                </>
              )}

              <button
                className="save-btn"
                onClick={saveProfile}
              >
                Save Profile
              </button>

            </div>

          ) : (

            <div className="profile-widgets">

              {/* FARM INFO */}

              {role === "farmer" && (
                <div className="widget">

                  <h3>🌾 Farm Information</h3>

                  <p>
                    <b>Farm Type:</b>{" "}
                    {profile.farm_type || "Not Added"}
                  </p>

                  <p>
                    <b>Main Crop:</b>{" "}
                    {profile.main_crop || "Not Added"}
                  </p>

                  <p>
                    <b>Farm Size:</b>{" "}
                    {profile.farm_size || "Not Added"}
                  </p>

                </div>
              )}

              {/* ACCOUNT */}

              <div className="widget">

                <h3>📊 Account Status</h3>

                <p>
                  {profile.status || "Pending"}
                </p>

                <p>
                  {role === "farmer"
                    ? "Active Seller"
                    : "Active Buyer"}
                </p>

              </div>

              {/* LOCATION */}

              <div className="widget">

                <h3>📍 Location Status</h3>

                <p>
                  {profile.location_enabled
                    ? "Enabled"
                    : "Disabled"}
                </p>

                <p>
                  {profile.address || "No address added"}
                </p>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* LOCATION MODAL */}

      {showLocationPrompt && (

        <div className="location-overlay">

          <div className="location-modal">

            <h3>Enable Location</h3>

            <p>
              Allow location access for better services.
            </p>

            <div className="location-actions">

              <button
                style={{
                  background: "green",
                  color: "white"
                }}
                onClick={detectLocation}
              >
                Enable
              </button>

              <button
                style={{
                  background: "red",
                  color: "white"
                }}
                onClick={() => setShowLocationPrompt(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;