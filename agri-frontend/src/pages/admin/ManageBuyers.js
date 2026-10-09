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

      setBuyers(res.data);

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

  // DELETE USER

  const deleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this buyer? This will also remove their related orders, cart, and wishlist items.")) {
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin/users/delete/", { email });
      if (res.data.msg) {
        setBuyers((prev) => prev.filter((b) => b.email !== email));
        setMessage("Buyer deleted successfully");
      } else {
        setMessage("Failed to delete buyer");
      }
    } catch (err) {
      console.log(err.response);
      setMessage(err?.response?.data?.error || "Failed to delete buyer");
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
                No buyers found
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
                    className="reject-btn"
                    style={{ backgroundColor: "#e74c3c", marginLeft: "5px" }}
                    onClick={() => deleteUser(buyer.email)}
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

export default ManageBuyers;