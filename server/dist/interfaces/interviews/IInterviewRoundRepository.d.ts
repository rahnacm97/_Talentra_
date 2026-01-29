import { IInterviewRound, IInterviewRoundQuery, IInterviewRoundWithDetails } from "./IInterviewRound";
export interface IInterviewRoundRepository {
    create(roundData: Partial<IInterviewRound>): Promise<IInterviewRound>;
    findById(id: string): Promise<IInterviewRound | null>;
    findByRoomId(roomId: string): Promise<IInterviewRound | null>;
    findByInterviewId(interviewId: string): Promise<IInterviewRound[]>;
    findByApplicationId(applicationId: string): Promise<IInterviewRound[]>;
    update(id: string, updateData: Partial<IInterviewRound>): Promise<IInterviewRound | null>;
    delete(id: string): Promise<boolean>;
    findWithPagination(query: IInterviewRoundQuery): Promise<{
        rounds: IInterviewRoundWithDetails[];
        total: number;
    }>;
    addFeedback(roundId: string, feedback: IInterviewRound["feedback"][0]): Promise<IInterviewRound | null>;
    addParticipant(roundId: string, participant: IInterviewRound["participants"][0]): Promise<IInterviewRound | null>;
    removeParticipant(roundId: string, userId: string): Promise<IInterviewRound | null>;
}
//# sourceMappingURL=IInterviewRoundRepository.d.ts.map