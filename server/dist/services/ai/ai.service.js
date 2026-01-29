"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const ai_prompts_1 = require("../../shared/constants/ai.prompts");
class AIService {
    constructor(apiKey) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error("GEMINI_API_KEY is not defined");
        }
        this._genAI = new generative_ai_1.GoogleGenerativeAI(key);
        this._model = this._genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });
    }
    async generateCandidateSummary(profileData) {
        try {
            const prompt = (0, ai_prompts_1.getCandidateSummaryPrompt)(profileData);
            const result = await this._model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error("Error generating AI summary:", error);
            throw new Error("Failed to generate candidate summary");
        }
    }
    async calculateMatchScore(candidate, jobDescription, jobTitle) {
        try {
            const prompt = (0, ai_prompts_1.getMatchScorePrompt)(candidate, jobTitle, jobDescription);
            const result = await this._model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up markdown code blocks if present
            const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error("Error calculating match score:", error);
            // Fallback for failed JSON parsing or generation
            return { score: 0, reason: "Could not calculate score at this time." };
        }
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map