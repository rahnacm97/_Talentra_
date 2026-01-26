export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: "Candidate" | "Employer" | "Guest";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: "Candidate" | "Employer" | "Admin" | "Guest";
  blocked: boolean;
  emailVerified?: boolean;
  verified?: boolean;
  hasActiveSubscription?: boolean;
  trialEndsAt?: string;
  currentPlan?: "free" | "professional" | "enterprise";
  profileImage?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// export interface AuthResponse {
//   user: {
//     _id: string;
//     email: string;
//     name: string;
//     role: "Candidate" | "Employer" | "Admin";
//     blocked: boolean;
//     emailVerified: boolean;
//     verified: boolean;
//   };
//   accessToken: string;
//   refreshToken: string;
// }

export interface AuthState {
  user: AuthResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  forgotPasswordEmail: string | null;
  isInitialized: boolean;
  blocked: boolean;
}
