export const adminLogin = (token) => {
  localStorage.setItem("adminToken", token);
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem("adminToken") !== null;
};