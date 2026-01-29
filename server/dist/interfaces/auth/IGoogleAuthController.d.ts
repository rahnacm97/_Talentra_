import { NextFunction, Request, Response } from "express";
export interface IGoogleAuthController {
    loginSuccess(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
//# sourceMappingURL=IGoogleAuthController.d.ts.map