export interface INotificationService {
    sendOtp(email: string, otp: string): Promise<void>;
    sendEmployerVerificationEmail(params: {
        to: string;
        name: string;
        companyName: string;
    }): Promise<void>;
    sendEmployerRejectionEmail(params: {
        to: string;
        name: string;
        companyName: string;
        reason: string;
        loginUrl: string;
    }): Promise<void>;
}
//# sourceMappingURL=INotificationService.d.ts.map