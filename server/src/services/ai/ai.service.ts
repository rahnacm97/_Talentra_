import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { IAIService } from "../../interfaces/ai/IAIService";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
import {
  getCandidateSummaryPrompt,
  getMatchScorePrompt,
} from "../../shared/constants/ai.prompts";

export class AIService implements IAIService {
  private _genAI: GoogleGenerativeAI | undefined;
  private _model: GenerativeModel | undefined;

  constructor() {
    // Lazy initialization
  }

  private initModel() {
    if (this._model) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    this._genAI = new GoogleGenerativeAI(apiKey);
    this._model = this._genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });
  }

  async generateCandidateSummary(
    profileData: Partial<ICandidate>,
  ): Promise<string> {
    try {
      this.initModel();

      const prompt = getCandidateSummaryPrompt(profileData);

      const result = await this._model!.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating AI summary:", error);
      throw new Error("Failed to generate candidate summary");
    }
  }
  async calculateMatchScore(
    candidate: Partial<ICandidate>,
    jobDescription: string,
    jobTitle: string,
  ): Promise<{ score: number; reason: string }> {
    try {
      this.initModel();

      const prompt = getMatchScorePrompt(candidate, jobTitle, jobDescription);

      const result = await this._model!.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error calculating match score:", error);
      // Fallback for failed JSON parsing or generation
      return { score: 0, reason: "Could not calculate score at this time." };
    }
  }
}
