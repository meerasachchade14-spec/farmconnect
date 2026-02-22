const API_BASE = "http://localhost:5000/api/farmer";


// 🌾 Add Product
export const addProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return res.json();
};


// 🌾 Get My Products
export const getMyProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
};


// 🌾 Get Orders
export const getOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
};


// 🌾 Get Earnings
export const getEarnings = async () => {
  const res = await fetch(`${API_BASE}/earnings`);
  return res.json();
};


// 🌾 Get Farmer Profile
export const getProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`);
  return res.json();
};