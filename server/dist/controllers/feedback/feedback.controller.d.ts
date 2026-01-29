import { Request, Response } from "express";
import { IFeedbackService } from "../../interfaces/feedback/IFeedbackService";
import { IFeedbackController } from "../../interfaces/feedback/IFeedbackController";
export declare class FeedbackController implements IFeedbackController {
    private readonly _feedbackService;
    constructor(_feedbackService: IFeedbackService);
    submitFeedback: (req: Request, res: Response) => Promise<void>;
    getAllFeedback: (req: Request, res: Response) => Promise<void>;
    updateFeedback: (req: Request, res: Response) => Promise<void>;
    getFeaturedFeedback: (_req: Request, res: Response) => Promise<void>;
    getPublicFeedback: (_req: Request, res: Response) => Promise<void>;
    deleteFeedback: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=feedback.controller.d.ts.map