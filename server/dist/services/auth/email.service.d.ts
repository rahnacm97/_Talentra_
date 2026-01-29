import { INotificationService } from "../../interfaces/auth/INotificationService";
export declare class EmailService implements INotificationService {
    private _transporter;
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
//# sourceMappingURL=email.service.d.ts.map