import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderAdmin.css";

function OrderAdmin() {

  const [orders, setOrders] = useState([]);

  // FETCH ORDERS

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/orders/"
      );

      setOrders(res.data || []);

    } catch (err) {

      console.log(err);

      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE STATUS

  const updateOrderStatus = async (id, status) => {

    try {

      await axios.patch(
        "http://127.0.0.1:8000/api/admin/orders/status/",
        {
          id,
          status
        }
      );

      fetchOrders();

    } catch (err) {

      console.log(err);

      alert("Failed to update status");
    }
  };

  // STATUS CLASS

  const getStatusClass = (status) => {

    if (!status) return "status-pending";

    const s = status.toLowerCase();

    if (s === "approved") return "status-delivered";
    if (s === "rejected") return "status-cancel";

    return "status-pending";
  };

  return (

    <div className="orders-container">

      <h2>
        All Orders
      </h2>

      <table className="orders-table">

        <thead>

          <tr>

            <th>Buyer</th>
            <th>Farmer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {orders.length === 0 ? (

            <tr>

              <td colSpan="8">
                No orders found
              </td>

            </tr>

          ) : (

            orders.map((order) => (

              <tr key={order.id}>

                <td>
                  {order.buyer_email}
                </td>

                <td>
                  {order.farmer_email}
                </td>

                <td>
                  {order.product_name}
                </td>

                <td>
                  {order.quantity}
                </td>

                <td>
                  {order.payment_method || "UPI"}
                </td>

                <td>
                  ₹{order.amount || 0}
                </td>

                <td
                  className={`order-status ${getStatusClass(order.status)}`}
                >
                  {order.status || "Pending"}
                </td>

                <td className="admin-actions">

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateOrderStatus(order.id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateOrderStatus(order.id, "Rejected")
                    }
                  >
                    Reject
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

export default OrderAdmin;