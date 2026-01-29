import { Request, Response, NextFunction } from "express";
export interface ISubscriptionController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    downloadInvoice(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ISubscriptionController.d.ts.map