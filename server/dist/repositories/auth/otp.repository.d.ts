import { IOtp } from "../../interfaces/auth/IOtp";
import { IOtpRepository } from "../../interfaces/auth/IOtpRepository";
export declare class OtpRepository implements IOtpRepository {
    createOtp(data: IOtp): Promise<IOtp>;
    findOtp(email: string, purpose: string): Promise<IOtp | null>;
    deleteOtp(email: string, purpose: string): Promise<void>;
}
//# sourceMappingURL=otp.repository.d.ts.map