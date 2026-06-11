import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyCart.css";
import { useNavigate } from "react-router-dom";

function MyCart() {

  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const email = localStorage.getItem("email");

    axios
      .get(`http://127.0.0.1:8000/api/buyer/order/${email}/`)
      .then(res => {
        setOrders(res.data);
      });

    axios
      .get(`http://127.0.0.1:8000/api/buyer/cart/${email}/`)
      .then(res => {
        setCart(res.data);
      });

  }, []);

  const handleBuyNow = (item) => {

    console.log("BUY NOW ITEM:", item);

    localStorage.setItem(
      "checkoutProduct",
      JSON.stringify(item)
    );

    navigate("/buyer-dashboard/payment");

  };

  return (

    <div className="orders">

      <h2>My Cart</h2>

      <h3>Cart Items</h3>

      <div className="order-grid">

        {cart.length === 0 ? (

          <p>No items in cart</p>

        ) : (

          cart.map((item) => (

            <div className="order-card" key={item.id}>

              <h3>{item.product_name}</h3>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Price: ₹{item.price}
              </p>

              <p>
                Farmer: {item.farmer_email || "Not Found"}
              </p>

              <p>Status: In Cart</p>

              <div className="order-actions">

                <button
                  className="buy-btn"
                  onClick={() => handleBuyNow(item)}
                >
                  Buy Now
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      <h3 className="orders-title">
        My Orders
      </h3>

      <div className="order-grid">

        {orders.length === 0 ? (

          <p>No orders found</p>

        ) : (

          orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <h3>{order.product_name}</h3>

              <p>
                Quantity: {order.quantity}
              </p>

              <p>
                Amount: ₹{order.amount}
              </p>

              <p>
                Payment: {order.payment_method}
              </p>

              <p className={`status ${order.status?.toLowerCase()}`}>
                {order.status}
              </p>

              <div className="order-actions">

                <button className="track-btn">
                  Track Order
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default MyCart;
