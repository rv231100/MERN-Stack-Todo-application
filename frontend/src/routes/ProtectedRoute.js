import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  //wait until we know whether a saved session exists.
  if (loading) {
    return <div className="auth-loading">Checking your Session...</div>;
  }
  //no valid session?go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //authenticated? render the requested page
  return <Outlet />;
};

export default ProtectedRoute;
