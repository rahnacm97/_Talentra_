export interface AuthSignupDTO {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  userType: "Candidate" | "Employer";
  emailVerified?: boolean;
}

export interface AuthLoginDTO {
  email: string;
  password: string;
  userType: "Candidate" | "Employer";
}
