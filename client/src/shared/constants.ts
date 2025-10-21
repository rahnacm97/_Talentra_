export const API_ROUTES = {
  ADMIN: {
    ADMINLOGIN: "/admin/login",
    ADMINLOGOUT: "/admin/logout",
    CANDIDATES: "/admin/candidates",
    BLOCK_UNBLOCK_CANDIDATE: "/admin/candidates/block-unblock",
    EMPLOYERS: "/admin/employers",
    BLOCK_UNBLOCK_EMPLOYER: "/admin/employers/block-unblock",
  },
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
  },
  CANDIDATE: {
    PROFILE: (id: string) => `/candidate/${id}`,
  },
  EMPLOYER: {
    PROFILE: (id: string) => `/employer/${id}`,
  },
} as const;

export const FRONTEND_ROUTES = {
  ADMIN_DASHBOARD: "/admin-dashboard",
  ADMINLOGIN: "/admin-signin",
  LOGIN: "/login",
  HOME: "/",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  AUTHSUCCESS: "/auth-success",
  CANDIDATEPROFILE: "/candidate-profile",
  EMPLOYERPROFILE: "/employer-profile",
  ADMINEMPLOYERS: "/admin-employers",
  ADMINCANDIDATES: "/admin-candidates",
} as const;
