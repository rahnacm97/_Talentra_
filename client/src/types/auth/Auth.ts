export interface AuthSignupDTO{ 
    email: string; 
    password: string; 
    name: string; 
    phoneNumber: string; 
    userType: "Candidate" | "Employer" ; 
} 
export interface SignupRequest { 
    name: string; 
    email: string; 
    password: string; 
    phoneNumber: string; 
    userType: "Candidate" | "Employer"; 
} 

export interface LoginRequest { 
    email: string; 
    password: string; 
} 

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "Candidate" | "Employer";
  };
}


export interface LoginErrors { 
    email?: string; 
    password?: string; 
}

export interface AuthState {
  user: AuthResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  forgotPasswordEmail: string | null,
}