import { Request, Response, NextFunction } from "express";
/**
 * Interface for AI Job Controller
 * Following Interface Segregation Principle (ISP)
 */
export interface IAIJobController {
    /**
     * Get AI-generated suggestions for job requirements and responsibilities
     * @param req - Express request with query params: title, experience, department
     * @param res - Express response
     * @param next - Express next function
     */
    getSuggestions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Enhance job description with AI improvements
     * @param req - Express request with body: description, title
     * @param res - Express response
     * @param next - Express next function
     */
    enhanceDescription(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IAIJobController.d.ts.map