import { FRONTEND_ROUTES } from "../shared/constants";

export const isPublicAuthRoute = (path: string): boolean => {
  return (
    path === FRONTEND_ROUTES.LOGIN ||
    path === FRONTEND_ROUTES.SIGNUP ||
    path === FRONTEND_ROUTES.ADMINLOGIN
  );
};

export const isProtectedRoute = (path: string): boolean => {
  return (
    path === FRONTEND_ROUTES.CANDIDATEPROFILE ||
    path === FRONTEND_ROUTES.EMPLOYERPROFILE
  );
};

export const isAdminRoute = (path: string): boolean => {
  return (
    path === FRONTEND_ROUTES.ADMIN_DASHBOARD ||
    path === FRONTEND_ROUTES.ADMINCANDIDATES ||
    path === FRONTEND_ROUTES.ADMINEMPLOYERS
  );
};

export const getRedirectPath = (userRole?: string): string => {
  if (userRole === "Admin") {
    return FRONTEND_ROUTES.ADMIN_DASHBOARD;
  }
  return FRONTEND_ROUTES.HOME;
};
