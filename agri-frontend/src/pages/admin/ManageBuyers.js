import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBuyer.css";

function ManageBuyers() {

  const [buyers, setBuyers] = useState([]);
  const [message, setMessage] = useState("");

  // LOAD BUYERS

  const loadBuyers = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/users/buyer/"
      );

      const pendingBuyers = res.data.filter(
        (b) =>
          (b.status || "").toLowerCase() !== "approved" &&
          (b.status || "").toLowerCase() !== "rejected"
      );

      setBuyers(pendingBuyers);

    } catch (err) {

      console.log(err);
      setBuyers([]);

    }
  };

  useEffect(() => {
    loadBuyers();
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

        setBuyers((prev) =>
          prev.filter((b) => b.email !== email)
        );

        setMessage(
          status === "Approved"
            ? "Buyer accepted successfully"
            : "Buyer ignored successfully"
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

    <div className="buyers-container">

      <h2>Buyers List</h2>

      {message && (
        <p className="status-msg">
          {message}
        </p>
      )}

      <table className="buyers-table">

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

          {buyers.length === 0 ? (

            <tr>
              <td colSpan="6">
                No pending buyers
              </td>
            </tr>

          ) : (

            buyers.map((buyer, index) => (

              <tr key={index}>

                <td>

                  <img
                    src={
                      buyer.avatar_url ||
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
                  {buyer.name || "Buyer"}
                </td>

                <td>
                  {buyer.email}
                </td>

                <td>
                  {buyer.phone || "-"}
                </td>

                <td
                  className={
                    (buyer.status || "").toLowerCase() === "approved"
                      ? "status-active"
                      : "status-block"
                  }
                >
                  {buyer.status || "Pending"}
                </td>

                <td>

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateStatus(
                        buyer.email,
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
                        buyer.email,
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

export default ManageBuyers;