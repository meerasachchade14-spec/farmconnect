import React, { useEffect, useState } from "react";
import axios from "axios";
import "./farmer.css";

function DashboardHome() {
  const [products, setProducts] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    axios.get(`http://127.0.0.1:8000/api/farmer/products/${email}/`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));

    axios.get(`http://127.0.0.1:8000/api/farmer/orders/${email}/`)
      .then(res => setOrdersCount(res.data ? res.data.length : 0))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      {/* DASHBOARD CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{ordersCount}</p>
        </div>
        <div className="card">
          <h3>Total Earnings</h3>
          <p>₹24,000</p>
        </div>
      </div>

      {/* CROPS DISPLAY FROM MYPRODUCT */}
      <div className="featured-section">
        <h3>🌾 Your Crops</h3>
        <div className="crop-grid">
          {products.length === 0 ? (
            <p style={{marginTop: '1rem', color: '#555'}}>No products added yet.</p>
          ) : (
            products.slice(0, 4).map((item, index) => (
              <div className="crop-card" key={index}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div style={{height: '150px', background: '#e8f5e9', borderRadius: '15px', marginBottom: '1rem'}}></div>
                )}
                <h4>{item.name}</h4>
                <p>₹ {item.price} /kg</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MARKET INSIGHT */}
      <div className="insight-box">
        <h3>📊 Market Insight</h3>
        <p>
          Organic crops demand is increasing this season.
          Farmers selling wheat and vegetables are getting higher prices.
        </p>
      </div>

      {/* PREMIUM FEATURE */}
      <div className="weather-box">
        <h3>🌦 Farmer Tip</h3>
        <p>
          Best time to water crops is early morning or evening.
          This helps reduce evaporation and improves crop growth.
        </p>
      </div>
    </div>
  );
}

export default DashboardHome;