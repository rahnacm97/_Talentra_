import { NextFunction, Request, Response } from "express";
import { IPasswordService } from "../../interfaces/auth/IPasswordService";
import { IPasswordController } from "../../interfaces/auth/IPasswordController";
export declare class PasswordController implements IPasswordController {
    private _passwordService;
    constructor(_passwordService: IPasswordService);
    requestReset: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=password.controller.d.ts.map