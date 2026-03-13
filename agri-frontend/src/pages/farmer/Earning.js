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

  const monthlyData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Monthly Earnings",
        data: [2000, 3500, 4200, 3000, 5000, 6000],
        backgroundColor: "#2e7d32"
      }
    ]
  };

  const profitExpense = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Profit",
        data: [1200, 2000, 3000, 2200, 3500, 4200],
        borderColor: "#2e7d32",
        backgroundColor: "#2e7d32",
        tension: 0.4
      },
      {
        label: "Expense",
        data: [800, 1500, 1200, 800, 1500, 1800],
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
        data: [8000, 4500, 2000, 9500],
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
          <p className="earning-amount">₹24,000</p>
        </div>

        <div className="earning-card">
          <h3>Total Orders</h3>
          <p className="earning-number">14</p>
        </div>

        <div className="earning-card">
          <h3>Top Crop</h3>
          <p className="earning-number">Wheat</p>
        </div>

        <div className="earning-card">
          <h3>This Month</h3>
          <p className="earning-amount">₹6,500</p>
        </div>
      </div>

      {/* MONTHLY EARNINGS BAR CHART */}
      <div className="chart-box">
        <h3>Monthly Earnings</h3>
        <Bar data={monthlyData} options={{ responsive:true, maintainAspectRatio:false, height:150 }} />
      </div>

      {/* PROFIT VS EXPENSE LINE CHART */}
      <div className="chart-box">
        <h3>Profit vs Expense</h3>
        <Line data={profitExpense} options={{ responsive:true, maintainAspectRatio:false, height:150 }} />
      </div>

      {/* CROP WISE PIE CHART */}
      <div className="chart-box">
        <h3>Crop Wise Earnings</h3>
        <Pie data={cropData} options={{ responsive:true, maintainAspectRatio:false, height:150 }} />
      </div>

    </div>
  );
}

export default Earning;