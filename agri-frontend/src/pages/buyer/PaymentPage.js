import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentPage.css";

function PaymentPage() {

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [message, setMessage] = useState("");

  const buyerEmail =
    localStorage.getItem("email");

  useEffect(() => {

    const savedProduct =
      localStorage.getItem("checkoutProduct");

    if (savedProduct) {

      setProduct(JSON.parse(savedProduct));

    }

  }, []);

  const totalAmount =
    product
      ? Number(product.price) * Number(quantity)
      : 0;

  const placeOrder = async () => {

    if (!quantity || !paymentMethod) {

      setMessage(
        "Quantity and payment method required"
      );

      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/payment/place/",
        {

          buyer_email: buyerEmail,

          farmer_email:
            product.farmer_email,

          product_name:
            product.product_name ||
            product.name,

          quantity: quantity,

          amount: totalAmount,

          payment_method: paymentMethod,

          status: "Pending"

        }
      );

      setMessage("Order Placed Successfully ✅");

      localStorage.removeItem(
        "checkoutProduct"
      );

    } catch (err) {

      setMessage("Order Failed ❌");
    }
  };

  return (

    <div className="payment-container">

      <div className="payment-card">

        <h2>Checkout</h2>

        {message && (
          <p className="payment-msg">
            {message}
          </p>
        )}

        {/* PRODUCT BOX */}

        <div className="payment-box">

          <h3>Your Products</h3>

          {product && (

            <>

              <p>
                <b>Product:</b>
                {" "}
                {product.product_name || product.name}
              </p>

              <p>
                <b>Price:</b>
                {" "}
                ₹{product.price}
              </p>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Quantity"
              />

              <p className="total-bill">
                Total Bill: ₹{totalAmount}
              </p>

            </>

          )}

        </div>

        {/* PAYMENT BOX */}

        <div className="payment-box">

          <h3>Select Payment</h3>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          >

            <option value="">
              Select Payment Method
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="COD">
              Cash On Delivery
            </option>

          </select>

        </div>

        <button
          className="pay-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>

      </div>

    </div>
  );
}

export default PaymentPage;