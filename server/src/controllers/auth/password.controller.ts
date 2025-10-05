import { Request, Response } from "express";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";

export class PasswordController{
    constructor(private passwordService: IPasswordService){}

    requestReset = async (req: Request, res: Response) => {
        try {
            const result = await this.passwordService.requestReset(req.body);
            res.status(200).json({ message: "OTP sent fro password reset", result})
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    }

    resetPassword = async(req: Request, res: Response) => {
        try {
            await this.passwordService.resetPassword(req.body);
            res.status(200).json({ message: "Password reset successfull"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    }
}