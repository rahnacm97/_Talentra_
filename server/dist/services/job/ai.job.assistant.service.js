"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIJobAssistantService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = require("../../shared/utils/logger");
/**
 * AI-powered job assistance service implementation
 * Following Single Responsibility Principle (SRP) - Only handles AI operations
 * Following Dependency Inversion Principle (DIP) - Depends on Google AI SDK abstraction
 */
class AIJobAssistantService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger_1.logger.warn("GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
            throw new Error("GEMINI_API_KEY is required for AI features");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7, // Balanced creativity
                maxOutputTokens: 1000,
            },
        });
    }
    /**
     * Generate job requirement suggestions
     */
    async suggestRequirements(jobTitle, experienceLevel, department) {
        const prompt = `
You are an HR expert. Suggest 6-8 realistic job requirements for this position:

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Department: ${department || "Not specified"}

Return ONLY a JSON array of requirement strings. Each requirement should be:
- Specific and measurable
- Appropriate for the experience level
- Industry-standard
- Concise (one line each)

Example format: ["5+ years of React experience", "Strong TypeScript skills"]

Return ONLY the JSON array, no markdown, no explanation.
`;
        try {
            const result = await this.model.generateContent(prompt);
            const text = this.cleanResponse(result.response.text());
            return JSON.parse(text);
        }
        catch (error) {
            logger_1.logger.error("Failed to generate requirement suggestions", { error });
            throw error;
        }
    }
    /**
     * Generate job responsibility suggestions
     */
    async suggestResponsibilities(jobTitle, experienceLevel, department) {
        const prompt = `
You are an HR expert. Suggest 6-8 realistic job responsibilities for this position:

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Department: ${department || "Not specified"}

Return ONLY a JSON array of responsibility strings. Each should be:
- Action-oriented (start with verbs like "Develop", "Lead", "Collaborate")
- Specific to the role
- Appropriate for the experience level
- Concise (one line each)

Example: ["Develop and maintain web applications", "Lead code reviews"]

Return ONLY the JSON array, no markdown, no explanation.
`;
        try {
            const result = await this.model.generateContent(prompt);
            const text = this.cleanResponse(result.response.text());
            return JSON.parse(text);
        }
        catch (error) {
            logger_1.logger.error("Failed to generate responsibility suggestions", { error });
            throw error;
        }
    }
    /**
     * Generate job title variations
     */
    async suggestTitleVariations(jobTitle) {
        const prompt = `
Given this job title: "${jobTitle}"

Suggest 3 alternative professional job titles that mean the same thing.

Return ONLY a JSON array of title strings.
Example: ["Senior Frontend Developer", "Lead React Engineer", "Principal UI Developer"]

Return ONLY the JSON array, no markdown, no explanation.
`;
        try {
            const result = await this.model.generateContent(prompt);
            const text = this.cleanResponse(result.response.text());
            return JSON.parse(text);
        }
        catch (error) {
            logger_1.logger.error("Failed to generate title variations", { error });
            throw error;
        }
    }
    /**
     * Enhance job description
     */
    async enhanceDescription(originalDescription, jobTitle) {
        if (originalDescription.length < 10) {
            throw new Error("Description too short to enhance. Please write at least a basic description first.");
        }
        const prompt = `
You are an HR copywriter. The employer wrote this job description:

"${originalDescription}"

Job Title: ${jobTitle}

Provide 2 enhanced versions that:
- Keep the original meaning and key points
- Make it more professional and engaging
- Add clarity without changing the intent
- Are concise (2-3 sentences max)

Return ONLY a JSON array with 2 enhanced versions.
Example: ["Enhanced version 1", "Enhanced version 2"]

Return ONLY the JSON array, no markdown, no explanation.
`;
        try {
            const result = await this.model.generateContent(prompt);
            const text = this.cleanResponse(result.response.text());
            return JSON.parse(text);
        }
        catch (error) {
            logger_1.logger.error("Failed to enhance description", { error });
            throw error;
        }
    }
    /**
     * Get all suggestions at once for efficiency
     */
    async getAllSuggestions(jobTitle, experienceLevel, department) {
        try {
            const [requirements, responsibilities, titleVariations] = await Promise.all([
                this.suggestRequirements(jobTitle, experienceLevel, department),
                this.suggestResponsibilities(jobTitle, experienceLevel, department),
                this.suggestTitleVariations(jobTitle),
            ]);
            return {
                requirements,
                responsibilities,
                titleVariations,
            };
        }
        catch (error) {
            logger_1.logger.error("Failed to get all AI suggestions", { error });
            // Return empty suggestions on failure instead of throwing
            return {};
        }
    }
    /**
     * Clean AI response by removing markdown code blocks
     * @private
     */
    cleanResponse(text) {
        return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }
}
exports.AIJobAssistantService = AIJobAssistantService;
//# sourceMappingURL=ai.job.assistant.service.js.map