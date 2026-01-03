import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRouteAdmin = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "writer") return <Navigate to="/writer" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouteAdmin;

