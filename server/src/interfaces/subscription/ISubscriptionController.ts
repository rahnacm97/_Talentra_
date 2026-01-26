import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
  createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  getSubscriptionHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
