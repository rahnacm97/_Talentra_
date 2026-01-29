import { IAIJobAssistantService, JobSuggestions } from "../../interfaces/jobs/IAIJobAssistantService";
/**
 * AI-powered job assistance service implementation
 * Following Single Responsibility Principle (SRP) - Only handles AI operations
 * Following Dependency Inversion Principle (DIP) - Depends on Google AI SDK abstraction
 */
export declare class AIJobAssistantService implements IAIJobAssistantService {
    private genAI;
    private model;
    constructor();
    /**
     * Generate job requirement suggestions
     */
    suggestRequirements(jobTitle: string, experienceLevel: string, department?: string): Promise<string[]>;
    /**
     * Generate job responsibility suggestions
     */
    suggestResponsibilities(jobTitle: string, experienceLevel: string, department?: string): Promise<string[]>;
    /**
     * Generate job title variations
     */
    suggestTitleVariations(jobTitle: string): Promise<string[]>;
    /**
     * Enhance job description
     */
    enhanceDescription(originalDescription: string, jobTitle: string): Promise<string[]>;
    /**
     * Get all suggestions at once for efficiency
     */
    getAllSuggestions(jobTitle: string, experienceLevel: string, department?: string): Promise<JobSuggestions>;
    /**
     * Clean AI response by removing markdown code blocks
     * @private
     */
    private cleanResponse;
}
//# sourceMappingURL=ai.job.assistant.service.d.ts.map