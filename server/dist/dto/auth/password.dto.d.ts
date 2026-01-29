export interface ForgotPasswordDTO {
    email: string;
    purpose: "forgot-password";
}
export interface ResetPasswordDTO {
    email: string;
    newPassword: string;
    userType: "Candidate" | "Employer";
}
export interface RequestResetResponseDTO {
    success: boolean;
    message: string;
}
export interface ResetPasswordResponseDTO {
    success: boolean;
    message: string;
}
//# sourceMappingURL=password.dto.d.ts.map