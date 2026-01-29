import { RoundStatus, IParticipant, IFeedback } from "../../interfaces/interviews/IInterviewRound";
export interface CreateRoundDto {
    roundName: string;
    roundSequence: number;
    scheduledDate?: Date;
    participants: IParticipant[];
    notes?: string;
}
export interface UpdateRoundDto {
    roundName?: string;
    scheduledDate?: Date;
    status?: RoundStatus;
    notes?: string;
}
export interface RescheduleRoundDto {
    scheduledDate: Date;
    reason?: string;
}
export interface CancelRoundDto {
    reason: string;
}
export interface SubmitFeedbackDto {
    rating: number;
    comments: string;
    recommendation: "proceed" | "hold" | "reject";
}
export interface AddParticipantDto {
    userId: string;
    role: "interviewer" | "panelist" | "observer";
    name: string;
    email: string;
}
export interface RoundResponseDto {
    id: string;
    applicationId: string;
    interviewId: string;
    roundName: string;
    roundSequence: number;
    roomId: string;
    scheduledDate?: Date;
    status: RoundStatus;
    participants: IParticipant[];
    feedback: IFeedback[];
    meetingLink: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RoundWithDetailsDto extends RoundResponseDto {
    application: {
        candidateName: string;
        candidateEmail: string;
        jobTitle: string;
    };
    interview: {
        totalRounds: number;
        roundsCompleted: number;
        overallStatus: string;
    };
    feedbackSummary?: {
        averageRating: number;
        totalFeedback: number;
        recommendations: {
            proceed: number;
            hold: number;
            reject: number;
        };
    };
}
export interface CreateMultipleRoundsDto {
    rounds: CreateRoundDto[];
}
export interface RoundsPaginatedDto {
    rounds: RoundWithDetailsDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=interviewRound.dto.d.ts.map