import React, { useState } from "react";
import "./Earning.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Earning() {
  const [year, setYear] = useState("2026");

  // 🔹 YEAR-WISE DATA
  const dataByYear = {
    "2026": {
      monthly: [2000, 3500, 4200, 3000, 5000, 6000],
      profit: [1200, 2000, 3000, 2200, 3500, 4200],
      expense: [800, 1500, 1200, 800, 1500, 1800],
      crop: [8000, 4500, 2000, 9500],
      totalEarning: "₹24,000",
      orders: 14,
      topCrop: "Wheat",
      thisMonth: "₹6,500"
    },
    "2025": {
      monthly: [1500, 2800, 3900, 2500, 4200, 4800],
      profit: [900, 1800, 2600, 2000, 3000, 3500],
      expense: [600, 1000, 1300, 500, 1200, 1300],
      crop: [6000, 4000, 2500, 7000],
      totalEarning: "₹19,700",
      orders: 11,
      topCrop: "Cotton",
      thisMonth: "₹4,800"
    },
    "2024": {
      monthly: [1000, 2000, 2500, 1800, 3000, 3500],
      profit: [700, 1400, 1800, 1500, 2200, 2600],
      expense: [300, 600, 700, 300, 800, 900],
      crop: [5000, 3000, 1500, 6000],
      totalEarning: "₹13,800",
      orders: 8,
      topCrop: "Rice",
      thisMonth: "₹3,500"
    }
  };

  const current = dataByYear[year];

  // 🔹 CHART DATA
  const monthlyData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Monthly Earnings",
        data: current.monthly,
        backgroundColor: "#2e7d32"
      }
    ]
  };

  const profitExpense = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Profit",
        data: current.profit,
        borderColor: "#2e7d32",
        backgroundColor: "#2e7d32",
        tension: 0.4
      },
      {
        label: "Expense",
        data: current.expense,
        borderColor: "#ff5252",
        backgroundColor: "#ff5252",
        tension: 0.4
      }
    ]
  };

  const cropData = {
    labels: ["Wheat","Rice","Corn","Cotton"],
    datasets: [
      {
        data: current.crop,
        backgroundColor: ["#2e7d32", "#66bb6a", "#ffca28", "#8d6e63"]
      }
    ]
  };

  return (
    <div className="earning-page">

      {/* YEAR FILTER */}
      <div className="filter-section">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option>2026</option>
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="earning-cards">
        <div className="earning-card">
          <h3>Total Earnings</h3>
          <p className="earning-amount">{current.totalEarning}</p>
        </div>

        <div className="earning-card">
          <h3>Total Orders</h3>
          <p className="earning-number">{current.orders}</p>
        </div>

        <div className="earning-card">
          <h3>Top Crop</h3>
          <p className="earning-number">{current.topCrop}</p>
        </div>

        <div className="earning-card">
          <h3>This Month</h3>
          <p className="earning-amount">{current.thisMonth}</p>
        </div>
      </div>

      {/* MONTHLY EARNINGS BAR CHART */}
      <div className="chart-box">
        <h3>Monthly Earnings</h3>
        <Bar data={monthlyData} options={{ responsive:true, maintainAspectRatio:false }} />
      </div>

      {/* PROFIT VS EXPENSE LINE CHART */}
      <div className="chart-box">
        <h3>Profit vs Expense</h3>
        <Line data={profitExpense} options={{ responsive:true, maintainAspectRatio:false }} />
      </div>

      {/* CROP WISE PIE CHART */}
      <div className="chart-box">
        <h3>Crop Wise Earnings</h3>
        <Pie data={cropData} options={{ responsive:true, maintainAspectRatio:false }} />
      </div>

    </div>
  );
}

export default Earning;