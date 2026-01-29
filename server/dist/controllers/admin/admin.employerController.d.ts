import { NextFunction, Request, Response } from "express";
import { IAdminEmployerService } from "../../interfaces/users/admin/IAdminEmployerService";
import { IAdminEmployerController } from "../../interfaces/users/admin/IAdminEmployerController";
export declare class AdminEmployerController implements IAdminEmployerController {
    private _employerService;
    constructor(_employerService: IAdminEmployerService);
    getAllEmployers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEmployerById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    blockUnblockEmployer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyEmployer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectEmployer: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=admin.employerController.d.ts.map