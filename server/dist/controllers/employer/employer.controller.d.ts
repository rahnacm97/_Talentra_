import { NextFunction, Request, Response } from "express";
import { IEmployerController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerService } from "../../interfaces/users/employer/IEmployerService";
export declare class EmployerController implements IEmployerController {
    private _employerService;
    constructor(_employerService: IEmployerService);
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=employer.controller.d.ts.map