import { Request, Response, NextFunction } from "express";
import { IAIJobController } from "../../interfaces/jobs/IAIJobController";
import { IAIJobAssistantService } from "../../interfaces/jobs/IAIJobAssistantService";
/**
 * AI Job Controller implementation
 * Following Single Responsibility Principle (SRP) - Only handles HTTP request/response
 * Following Dependency Inversion Principle (DIP) - Depends on IAIJobAssistantService interface
 */
export declare class AIJobController implements IAIJobController {
    private readonly _aiService;
    constructor(_aiService: IAIJobAssistantService);
    /**
     * GET /api/jobs/ai/suggestions
     * Query params: title, experience, department
     */
    getSuggestions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/jobs/ai/enhance-description
     * Body: { description, title }
     */
    enhanceDescription(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=ai.job.controller.d.ts.map