// // import { Navigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import type { RootState } from "../../app/store";

// // interface ProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
// //   const { user, accessToken, isInitialized } = useSelector(
// //     (state: RootState) => state.auth,
// //   );

// //   if (!isInitialized) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gray-50">
// //         <div className="text-lg">Loading...</div>
// //       </div>
// //     );
// //   }

// //   if (!user || !accessToken || !["Candidate", "Employer"].includes(user.role)) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   if (!["Candidate", "Employer"].includes(user.role)) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return <>{children}</>;
// // };


// // components/common/ProtectedRoute.tsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import { FRONTEND_ROUTES } from "../../shared/constants";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { user, accessToken, isInitialized } = useSelector(
//     (state: RootState) => state.auth,
//   );
//   const location = useLocation();

//   if (!isInitialized) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   // Check authentication and role
//   const isAuthenticated = user && accessToken && ["Candidate", "Employer"].includes(user.role);
  
//   if (!isAuthenticated) {
//     // Redirect and replace history to prevent back navigation
//     return <Navigate to={FRONTEND_ROUTES.LOGIN} state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// components/common/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FRONTEND_ROUTES } from "../../shared/constants";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken, isInitialized, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check for auth errors (blocked user, expired session)
  if (error && (error.includes("blocked") || error.includes("expired"))) {
    return <Navigate to={FRONTEND_ROUTES.LOGIN} replace />;
  }

  const isAuthenticated = user && 
                         accessToken && 
                         !error && 
                         ["Candidate", "Employer"].includes(user.role);
  
  if (!isAuthenticated) {
    return <Navigate to={FRONTEND_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};