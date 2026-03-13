import React from "react";
import "./ManageFarmers.css";

function ManageFarmers() {
  const farmers = [
    { name: "Rahul", city: "Punjab", status: "Active" },
    { name: "Suresh", city: "Gujarat", status: "Blocked" },
    { name: "Anita", city: "Maharashtra", status: "Active" },
  ];

  return (
    <div className="farmers-container">
      <h2>Farmers List</h2>
      <table className="farmers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer, index) => (
            <tr key={index}>
              <td>{farmer.name}</td>
              <td>{farmer.city}</td>
              <td className={farmer.status === "Active" ? "status-active" : "status-block"}>
                {farmer.status}
              </td>
              <td>
                <button className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageFarmers;