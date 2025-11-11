import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

export const AdminProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, accessToken, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();

  if (error && (error.includes("blocked") || error.includes("expired"))) {
    return <Navigate to={FRONTEND_ROUTES.LOGIN} replace />;
  }

  const isAdmin = user && accessToken && !error && user.role === "Admin";

  if (!isAdmin) {
    return (
      <Navigate
        to={FRONTEND_ROUTES.ADMINLOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};
