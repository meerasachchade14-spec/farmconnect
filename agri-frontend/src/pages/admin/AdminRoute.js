import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../../services/adminAuth";

const AdminRoute = ({ children }) => {

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default AdminRoute;
