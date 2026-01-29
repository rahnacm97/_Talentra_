import { IInterviewParticipantRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewParticipant } from "../../interfaces/interviews/IInterview";
export declare class InterviewParticipantRepository implements IInterviewParticipantRepository {
    create(data: Partial<IInterviewParticipant>): Promise<IInterviewParticipant>;
    findById(participantId: string): Promise<IInterviewParticipant | null>;
    findByRoundId(roundId: string): Promise<IInterviewParticipant[]>;
    findByRoundAndUser(roundId: string, userId: string): Promise<IInterviewParticipant | null>;
    updateOne(participantId: string, data: Partial<IInterviewParticipant>): Promise<IInterviewParticipant | null>;
    updateConnectionStatus(roundId: string, userId: string, status: string): Promise<IInterviewParticipant | null>;
    countByRoundId(roundId: string): Promise<number>;
    deleteById(participantId: string): Promise<boolean>;
    deleteByRoundId(roundId: string): Promise<boolean>;
    private toDomain;
}
//# sourceMappingURL=interviewParticipant.repository.d.ts.map