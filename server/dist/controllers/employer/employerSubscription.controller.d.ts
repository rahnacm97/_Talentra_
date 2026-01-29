import { NextFunction, Request, Response } from "express";
import { IInvoiceService, ISubscriptionService } from "../../interfaces/subscription/ISubscriptionService";
import { ISubscriptionController } from "../../interfaces/subscription/ISubscriptionController";
import { ISubscriptionRepository } from "../../interfaces/subscription/ISubscriptionRepo";
import { IEmployerRepository } from "../../interfaces/users/employer/IEmployerRepository";
export declare class SubscriptionController implements ISubscriptionController {
    private _subscriptionService;
    private _subscriptionRepository;
    private _employerRepository;
    private _invoiceService;
    constructor(_subscriptionService: ISubscriptionService, _subscriptionRepository: ISubscriptionRepository, _employerRepository: IEmployerRepository, _invoiceService: IInvoiceService);
    createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    downloadInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=employerSubscription.controller.d.ts.map