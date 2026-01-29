import { ICandidate } from "../users/candidate/ICandidate";
export interface IAIService {
    generateCandidateSummary(profileData: Partial<ICandidate>): Promise<string>;
    calculateMatchScore(candidate: Partial<ICandidate>, jobDescription: string, jobTitle: string): Promise<{
        score: number;
        reason: string;
    }>;
}
//# sourceMappingURL=IAIService.d.ts.map