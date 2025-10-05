import { Request, Response} from "express";
import { OtpService } from "../../services/auth/otp.service";
import { EmailService } from "../../services/auth/email.service";

export class OtpController{
    constructor(private otpService: OtpService){}

    sendOtp = async(req: Request, res: Response) => {
        try {
            const { email, purpose } = req.body;
            const result = await this.otpService.generateOtp(email, purpose);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    }

    verifyOtp = async(req: Request, res:Response) => {
        try {
            const { email, purpose, otp } = req.body;
            const result = await this.otpService.verifyOtp(email, purpose, otp);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message})
        }
    }
}