import { NextFunction, Request, Response } from "express";
import { IOtpService } from "../../interfaces/auth/IOtpService";
import { IOtpController } from "../../interfaces/auth/IOtpController";
export declare class OtpController implements IOtpController {
    private _otpService;
    constructor(_otpService: IOtpService);
    sendOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=otp.controller.d.ts.map