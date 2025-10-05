export interface ForgotPasswordDTO{
    email: string;
    purpose: "forgot-password";
}

export interface ResetPasswordDTO{
    email: string;
    newPassword: string;
    userType: "Candidate" | "Employer";
}