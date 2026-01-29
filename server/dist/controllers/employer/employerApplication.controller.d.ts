import { NextFunction, Request, Response } from "express";
import { IEmployerApplicationsController } from "../../interfaces/users/employer/IEmployerController";
import { IEmployerApplicationService } from "../../interfaces/applications/IApplicationService";
export declare class EmployerApplicationsController implements IEmployerApplicationsController {
    private readonly _service;
    constructor(_service: IEmployerApplicationService);
    getApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=employerApplication.controller.d.ts.map