import { IAIService } from "../../interfaces/ai/IAIService";
import { ICandidate } from "../../interfaces/users/candidate/ICandidate";
export declare class AIService implements IAIService {
    private _genAI;
    private _model;
    constructor(apiKey?: string);
    generateCandidateSummary(profileData: Partial<ICandidate>): Promise<string>;
    calculateMatchScore(candidate: Partial<ICandidate>, jobDescription: string, jobTitle: string): Promise<{
        score: number;
        reason: string;
    }>;
}
//# sourceMappingURL=ai.service.d.ts.map