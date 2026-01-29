"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIJobController = void 0;
const ApiError_1 = require("../../shared/utils/ApiError");
const httpStatusCode_1 = require("../../shared/httpStatus/httpStatusCode");
const logger_1 = require("../../shared/utils/logger");
/**
 * AI Job Controller implementation
 * Following Single Responsibility Principle (SRP) - Only handles HTTP request/response
 * Following Dependency Inversion Principle (DIP) - Depends on IAIJobAssistantService interface
 */
class AIJobController {
    constructor(_aiService) {
        this._aiService = _aiService;
    }
    /**
     * GET /api/jobs/ai/suggestions
     * Query params: title, experience, department
     */
    async getSuggestions(req, res, next) {
        try {
            const { title, experience, department } = req.query;
            // Validate required parameters
            if (!title || !experience) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Job title and experience level are required");
            }
            logger_1.logger.info("Generating AI suggestions", {
                title,
                experience,
                department,
            });
            const suggestions = await this._aiService.getAllSuggestions(title, experience, department);
            res.json({ success: true, suggestions });
        }
        catch (error) {
            logger_1.logger.error("AI suggestions error", { error });
            // Return empty suggestions on error instead of failing
            // This ensures the form still works even if AI fails
            if (error instanceof ApiError_1.ApiError) {
                next(error);
            }
            else {
                res.json({
                    success: true,
                    suggestions: {},
                    message: "AI suggestions temporarily unavailable",
                });
            }
        }
    }
    /**
     * POST /api/jobs/ai/enhance-description
     * Body: { description, title }
     */
    async enhanceDescription(req, res, next) {
        try {
            const { description, title } = req.body;
            // Validate required parameters
            if (!description || !title) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, "Description and title are required");
            }
            logger_1.logger.info("Enhancing job description", { title });
            const enhancements = await this._aiService.enhanceDescription(description, title);
            res.json({ success: true, enhancements });
        }
        catch (error) {
            logger_1.logger.error("Description enhancement error", { error });
            // Handle specific error cases
            if (error instanceof ApiError_1.ApiError) {
                next(error);
            }
            else if (error.message?.includes("too short")) {
                throw new ApiError_1.ApiError(httpStatusCode_1.HTTP_STATUS.BAD_REQUEST, error.message);
            }
            else {
                res.json({
                    success: false,
                    error: "Failed to enhance description. Please try again.",
                });
            }
        }
    }
}
exports.AIJobController = AIJobController;
//# sourceMappingURL=ai.job.controller.js.map