import { IInterviewRound, IInterviewRoundQuery, IInterviewRoundWithDetails, IParticipant } from "./IInterviewRound";
import { CreateRoundDto, UpdateRoundDto, RescheduleRoundDto, CancelRoundDto, SubmitFeedbackDto, AddParticipantDto } from "../../dto/interview/interviewRound.dto";
export interface IInterviewRoundService {
    createRound(interviewId: string, applicationId: string, roundData: CreateRoundDto): Promise<IInterviewRound>;
    createMultipleRounds(interviewId: string, applicationId: string, rounds: CreateRoundDto[]): Promise<IInterviewRound[]>;
    getRoundById(roundId: string): Promise<IInterviewRound>;
    getRoundByRoomId(roomId: string): Promise<IInterviewRound>;
    getRoundsByInterview(interviewId: string): Promise<IInterviewRound[]>;
    getRoundsByApplication(applicationId: string): Promise<IInterviewRound[]>;
    getRoundsWithPagination(query: IInterviewRoundQuery): Promise<{
        rounds: IInterviewRoundWithDetails[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateRound(roundId: string, updateData: UpdateRoundDto): Promise<IInterviewRound>;
    scheduleRound(roundId: string, scheduledDate: Date): Promise<IInterviewRound>;
    rescheduleRound(roundId: string, rescheduleData: RescheduleRoundDto): Promise<IInterviewRound>;
    cancelRound(roundId: string, cancelData: CancelRoundDto): Promise<IInterviewRound>;
    startRound(roundId: string): Promise<IInterviewRound>;
    completeRound(roundId: string): Promise<IInterviewRound>;
    addParticipant(roundId: string, participant: AddParticipantDto): Promise<IInterviewRound>;
    removeParticipant(roundId: string, userId: string): Promise<IInterviewRound>;
    updateParticipantRole(roundId: string, userId: string, role: IParticipant["role"]): Promise<IInterviewRound>;
    submitFeedback(roundId: string, interviewerId: string, interviewerName: string, feedbackData: SubmitFeedbackDto): Promise<IInterviewRound>;
    getFeedbackSummary(roundId: string): Promise<{
        averageRating: number;
        totalFeedback: number;
        recommendations: {
            proceed: number;
            hold: number;
            reject: number;
        };
        consensusRecommendation: "proceed" | "hold" | "reject" | "mixed";
    }>;
    generateMeetingLink(roundId: string): string;
    validateRoundAccess(roundId: string, userId: string): Promise<boolean>;
    checkAllRoundsComplete(interviewId: string): Promise<boolean>;
    deleteRound(roundId: string): Promise<void>;
}
//# sourceMappingURL=IInterviewRoundService.d.ts.map