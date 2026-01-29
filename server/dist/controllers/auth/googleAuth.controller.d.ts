import { Request, Response } from "express";
import { IGoogleAuthController } from "../../interfaces/auth/IGoogleAuthController";
export declare class GoogleAuthController implements IGoogleAuthController {
    loginSuccess: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=googleAuth.controller.d.ts.map