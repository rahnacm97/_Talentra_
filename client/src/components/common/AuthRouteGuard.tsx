import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FRONTEND_ROUTES } from "../../shared/constants";

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isInitialized) return;

    const currentPath = location.pathname;
    const isAdmin = user?.role === "Admin";
    const isAuthenticated = user && accessToken;

    if (currentPath === FRONTEND_ROUTES.SIGNUP) {
      return;
    }

    if (currentPath === FRONTEND_ROUTES.LOGIN && !isAuthenticated) {
      return;
    }

    const publicAuthRoutes = [
      FRONTEND_ROUTES.LOGIN,
      FRONTEND_ROUTES.SIGNUP,
      FRONTEND_ROUTES.ADMINLOGIN,
    ] as const;

    const isPublicAuthRoute = publicAuthRoutes.some(
      (route) => currentPath === route,
    );

    const isProtectedRoute =
      currentPath === FRONTEND_ROUTES.CANDIDATEPROFILE ||
      currentPath === FRONTEND_ROUTES.EMPLOYERPROFILE;

    const isAdminRoute =
      currentPath === FRONTEND_ROUTES.ADMIN_DASHBOARD ||
      currentPath === FRONTEND_ROUTES.ADMINCANDIDATES ||
      currentPath === FRONTEND_ROUTES.ADMINEMPLOYERS;

    if (isProtectedRoute && !isAuthenticated) {
      navigate(FRONTEND_ROUTES.LOGIN, { replace: true });
      return;
    }

    if (isAdminRoute && (!isAdmin || !isAuthenticated)) {
      navigate(FRONTEND_ROUTES.ADMINLOGIN, { replace: true });
      return;
    }

    if (
      isAdmin &&
      isAuthenticated &&
      currentPath === FRONTEND_ROUTES.ADMINLOGIN
    ) {
      navigate(FRONTEND_ROUTES.ADMIN_DASHBOARD, { replace: true });
      return;
    }

    if (isAuthenticated && !isAdmin && isPublicAuthRoute) {
      navigate(FRONTEND_ROUTES.HOME, { replace: true });
      return;
    }

    if (
      isAdmin &&
      isAuthenticated &&
      (currentPath === FRONTEND_ROUTES.LOGIN ||
        currentPath === FRONTEND_ROUTES.SIGNUP)
    ) {
      navigate(FRONTEND_ROUTES.ADMIN_DASHBOARD, { replace: true });
    }
  }, [location.pathname, user, accessToken, isInitialized, navigate]);

  return <>{children}</>;
};

export default AuthRouteGuard;
