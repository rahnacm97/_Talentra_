// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../app/store";

// interface Props { children: React.ReactNode; }

// const PublicRoute: React.FC<Props> = ({ children }) => {
//   const { user, accessToken } = useSelector((s: RootState) => s.auth);
//   const isAuthenticated = !!user && !!accessToken;

//   // Pure render-time redirect only
//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// export default PublicRoute;


// src/components/common/PublicRoute.tsx
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

  if (user && ["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

