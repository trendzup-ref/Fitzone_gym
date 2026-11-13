import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AdminContext } from "../../context/AdminContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AdminContext);

  // Wait until authentication check completes
  if (loading) {
    return <p>Loading...</p>;
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;