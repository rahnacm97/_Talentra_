import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { IAuthController } from "../../interfaces/auth/IAuthController";
export declare class AuthController implements IAuthController {
    private _authService;
    constructor(_authService: IAuthService);
    signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map