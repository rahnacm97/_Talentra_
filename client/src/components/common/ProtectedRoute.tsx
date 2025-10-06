import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

interface Props { children: React.ReactNode; }

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { user,  } = useSelector((s: RootState) => s.auth);

  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
