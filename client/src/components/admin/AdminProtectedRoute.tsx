// // import { Navigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import type { RootState } from "../../app/store";
// // import { FRONTEND_ROUTES } from "../../shared/constants";

// // interface AdminProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
// //   const { user, accessToken } = useSelector((state: RootState) => state.auth);

// //   if (!user || !accessToken || user.role !== "Admin") {
// //     return <Navigate to={FRONTEND_ROUTES.ADMINLOGIN} replace />;
// //   }

// //   return <>{children}</>;
// // };

// // components/admin/AdminProtectedRoute.tsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { FRONTEND_ROUTES } from "../../shared/constants";

// interface AdminProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
//   const { user, accessToken } = useSelector((state: RootState) => state.auth);
//   const location = useLocation();

//   const isAdmin = user && accessToken && user.role === "Admin";

//   if (!isAdmin) {
//     return <Navigate to={FRONTEND_ROUTES.ADMINLOGIN} state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// components/admin/AdminProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FRONTEND_ROUTES } from "../../shared/constants";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken, error } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Check for auth errors
  if (error && (error.includes("blocked") || error.includes("expired"))) {
    return <Navigate to={FRONTEND_ROUTES.LOGIN} replace />;
  }

  const isAdmin = user && accessToken && !error && user.role === "Admin";

  if (!isAdmin) {
    return <Navigate to={FRONTEND_ROUTES.ADMINLOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};