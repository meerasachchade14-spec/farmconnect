import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css";

function Order() {

  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD DATA

  const fetchData = async () => {

    try {

      const email = localStorage.getItem("email");

      const ordersRes = await axios.get(
        `http://127.0.0.1:8000/api/farmer/orders/${email}/`
      );

      const cartRes = await axios.get(
        `http://127.0.0.1:8000/api/farmer/cart/${email}/`
      );

      setOrders(ordersRes.data || []);
      setCartItems(cartRes.data || []);

      setLoading(false);

    } catch (err) {

      console.log(err);

      setError("Failed to load orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UPDATE ORDER STATUS

  const updateStatus = async (id, status) => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/admin/orders/status/",
        {
          id,
          status
        }
      );

      fetchData();

    } catch (err) {

      console.log(err);

      alert("Failed to update status");
    }
  };

  // STATUS CLASS

  const getStatusClass = (status) => {

    if (!status) return "pending";

    const s = status.toLowerCase();

    if (s === "approved" || s === "accepted") return "delivered";
    if (s === "rejected") return "cancelled";

    return "pending";
  };

  if (loading) {
    return (
      <div className="order-page">
        Loading...
      </div>
    );
  }

  return (

    <div className="order-page">

      <h2 className="order-title">
        Farmer Orders
      </h2>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {orders.length === 0 && cartItems.length === 0 ? (

        <div className="no-orders">

          <h3>No Orders Yet</h3>

          <p>
            Orders will appear here when buyers place them.
          </p>

        </div>

      ) : (

        <div className="order-table">

          <table>

            <thead>

              <tr>

                <th>Product</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {/* CART ITEMS */}

              {cartItems.map((item) => (

                <tr key={`cart-${item.id}`}>

                  <td>
                    {item.product_name}
                  </td>

                  <td>
                    {item.buyer_email}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    -
                  </td>

                  <td>

                    <span className="status pending">
                      In Cart
                    </span>

                  </td>

                  <td>
                    -
                  </td>

                </tr>

              ))}

              {/* REAL ORDERS */}

              {orders.map((order) => (

                <tr key={order.id}>

                  <td>
                    {order.product_name}
                  </td>

                  <td>
                    {order.buyer_email}
                  </td>

                  <td>
                    {order.quantity}
                  </td>

                  <td>
                    {order.payment_method || "UPI"}
                  </td>

                  <td>

                    <span
                      className={`status ${getStatusClass(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </span>

                  </td>

                  <td className="action-buttons">

                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateStatus(order.id, "Accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(order.id, "Rejected")
                      }
                    >
                      Reject
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Order;