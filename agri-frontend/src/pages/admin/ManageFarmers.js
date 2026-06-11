import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageFarmers.css";

function ManageFarmers() {

  const [farmers, setFarmers] = useState([]);
  const [message, setMessage] = useState("");

  // LOAD FARMERS

  const loadFarmers = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/users/farmer/"
      );

      const pendingFarmers = res.data.filter(
        (f) =>
          (f.status || "").toLowerCase() !== "approved" &&
          (f.status || "").toLowerCase() !== "rejected"
      );

      setFarmers(pendingFarmers);

    } catch (err) {

      console.log(err);
      setFarmers([]);

    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // UPDATE STATUS

  const updateStatus = async (email, status) => {

    try {

      console.log("Sending:", email, status);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin/users/status/",
        {
          email: email,
          status: status
        }
      );

      console.log("Response:", res.data);

      if (res.data.msg) {

        // REMOVE USER FROM LIST

        setFarmers((prev) =>
          prev.filter((f) => f.email !== email)
        );

        setMessage(
          status === "Approved"
            ? "Farmer accepted successfully"
            : "Farmer ignored successfully"
        );

      } else {

        setMessage("Status update failed");

      }

    } catch (err) {

      console.log(err.response);

      const msg =
        err?.response?.data?.error ||
        "Failed to update status";

      setMessage(msg);

    }
  };

  return (

    <div className="farmers-container">

      <h2>Farmers List</h2>

      {message && (
        <p className="status-msg">
          {message}
        </p>
      )}

      <table className="farmers-table">

        <thead>

          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {farmers.length === 0 ? (

            <tr>
              <td colSpan="6">
                No pending farmers
              </td>
            </tr>

          ) : (

            farmers.map((farmer, index) => (

              <tr key={index}>

                <td>

                  <img
                    src={
                      farmer.avatar_url ||
                      "https://i.pravatar.cc/40"
                    }
                    alt="avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%"
                    }}
                  />

                </td>

                <td>
                  {farmer.name || "Farmer"}
                </td>

                <td>
                  {farmer.email}
                </td>

                <td>
                  {farmer.phone || "-"}
                </td>

                <td
                  className={
                    (farmer.status || "").toLowerCase() === "approved"
                      ? "status-active"
                      : "status-block"
                  }
                >
                  {farmer.status || "Pending"}
                </td>

                <td>

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateStatus(
                        farmer.email,
                        "Approved"
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateStatus(
                        farmer.email,
                        "Rejected"
                      )
                    }
                  >
                    Ignore
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

export default ManageFarmers;