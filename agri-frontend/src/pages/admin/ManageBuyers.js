import React from "react";
import "./ManageBuyer.css";

function ManageBuyers() {
  const buyers = [
    { name: "Amit", email: "amit@gmail.com", status: "Active" },
    { name: "Pooja", email: "pooja@gmail.com", status: "Blocked" },
    { name: "Ravi", email: "ravi@gmail.com", status: "Active" },
  ];

  return (
    <div className="buyers-container">
      <h2>Buyers List</h2>
      <table className="buyers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer, index) => (
            <tr key={index}>
              <td>{buyer.name}</td>
              <td>{buyer.email}</td>
              <td className={buyer.status === "Active" ? "status-active" : "status-block"}>
                {buyer.status}
              </td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageBuyers;