import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
export interface ValidatedRequest<T> extends Request {
    body: T;
}
export declare const validate: <T>(schema: ZodSchema<T>) => (req: Request, _4: Response, next: NextFunction) => void;
export declare const verifyCandidate: (req: Request<{
    candidateId: string;
}>, _res: Response, next: NextFunction) => void;
export declare const verifyEmployer: (req: Request<{
    id: string;
}>, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validationMiddleware.d.ts.map