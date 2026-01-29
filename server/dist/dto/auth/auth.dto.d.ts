export interface AuthSignupDTO {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    userType: "Candidate" | "Employer";
    emailVerified?: boolean;
    profileImage?: string | undefined;
}
export interface AuthLoginDTO {
    email: string;
    password: string;
    userType: "Candidate" | "Employer";
}
//# sourceMappingURL=auth.dto.d.ts.map