import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { FRONTEND_ROUTES } from "../../shared/constants";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (loading && location.pathname !== FRONTEND_ROUTES.SIGNUP) {
    return <div>Loading...</div>;
  }

  if (
    user?.role === "Admin" &&
    location.pathname === FRONTEND_ROUTES.ADMINLOGIN
  ) {
    return <Navigate to={FRONTEND_ROUTES.ADMIN_DASHBOARD} replace />;
  }

  if (
    user &&
    user.emailVerified &&
    ["/login", "/signup"].includes(location.pathname)
  ) {
    return <Navigate to={FRONTEND_ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
