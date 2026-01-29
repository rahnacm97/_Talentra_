import { Request, Response } from "express";
export interface IFeedbackController {
    submitFeedback(req: Request, res: Response): Promise<void>;
    getAllFeedback(req: Request, res: Response): Promise<void>;
    updateFeedback(req: Request, res: Response): Promise<void>;
    getFeaturedFeedback(req: Request, res: Response): Promise<void>;
    getPublicFeedback(req: Request, res: Response): Promise<void>;
    deleteFeedback(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IFeedbackController.d.ts.map