import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { admin } = useAppSelector((state) => state.adminAuth);
  const location = useLocation();

  if (admin && location.pathname === "/admin-signin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (
    user?.emailVerified &&
    ["/login", "/signup"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
