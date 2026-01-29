import { NextFunction, Request, Response } from "express";
import { IAdminAuthService } from "../../interfaces/users/admin/IAdminAuthService";
import { IAdminAuthController } from "../../interfaces/users/admin/IAdminAuthController";
export declare class AdminAuthController implements IAdminAuthController {
    private _adminAuthService;
    constructor(_adminAuthService: IAdminAuthService);
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=admin.authController.d.ts.map