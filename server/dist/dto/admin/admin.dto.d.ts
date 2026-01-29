export interface AdminLoginDTO {
    email: string;
    password: string;
}
export interface AdminResponseDTO {
    _id: string;
    email: string;
    name: string;
    role: "Admin";
    emailVerified: boolean;
}
//# sourceMappingURL=admin.dto.d.ts.map