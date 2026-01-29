export interface JobSuggestions {
    requirements?: string[];
    responsibilities?: string[];
    titleVariations?: string[];
}
export interface DescriptionEnhancement {
    enhancements: string[];
}
/**
 * Interface for AI-powered job assistance service
 * Following Interface Segregation Principle (ISP) - focused interface for AI operations
 */
export interface IAIJobAssistantService {
    /**
     * Generate job requirement suggestions based on job details
     * @param jobTitle - The job title
     * @param experienceLevel - Required experience level
     * @param department - Optional department name
     * @returns Array of suggested requirements
     */
    suggestRequirements(jobTitle: string, experienceLevel: string, department?: string): Promise<string[]>;
    /**
     * Generate job responsibility suggestions based on job details
     * @param jobTitle - The job title
     * @param experienceLevel - Required experience level
     * @param department - Optional department name
     * @returns Array of suggested responsibilities
     */
    suggestResponsibilities(jobTitle: string, experienceLevel: string, department?: string): Promise<string[]>;
    /**
     * Generate alternative job title variations
     * @param jobTitle - The original job title
     * @returns Array of alternative job titles
     */
    suggestTitleVariations(jobTitle: string): Promise<string[]>;
    /**
     * Enhance a job description with AI improvements
     * @param originalDescription - The original description text
     * @param jobTitle - The job title for context
     * @returns Array of enhanced description options
     */
    enhanceDescription(originalDescription: string, jobTitle: string): Promise<string[]>;
    /**
     * Get all suggestions at once for efficiency
     * @param jobTitle - The job title
     * @param experienceLevel - Required experience level
     * @param department - Optional department name
     * @returns Object containing all suggestion types
     */
    getAllSuggestions(jobTitle: string, experienceLevel: string, department?: string): Promise<JobSuggestions>;
}
//# sourceMappingURL=IAIJobAssistantService.d.ts.map