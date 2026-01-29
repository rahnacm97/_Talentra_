import { IInterviewParticipantService } from "../../interfaces/interviews/IInterviewService";
import { IInterviewParticipantRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewParticipant, ParticipantRole, ConnectionStatus } from "../../interfaces/interviews/IInterview";
export declare class InterviewParticipantService implements IInterviewParticipantService {
    private readonly _repository;
    constructor(_repository: IInterviewParticipantRepository);
    addParticipant(roundId: string, participantData: {
        userId: string;
        role: ParticipantRole | string;
        name: string;
        email: string;
    }): Promise<IInterviewParticipant>;
    getParticipants(roundId: string): Promise<IInterviewParticipant[]>;
    getParticipant(roundId: string, userId: string): Promise<IInterviewParticipant | null>;
    updateParticipantStatus(roundId: string, userId: string, status: ConnectionStatus): Promise<IInterviewParticipant | null>;
    recordJoin(roundId: string, userId: string): Promise<IInterviewParticipant | null>;
    recordLeave(roundId: string, userId: string): Promise<IInterviewParticipant | null>;
    removeParticipant(roundId: string, userId: string): Promise<boolean>;
    getParticipantCount(roundId: string): Promise<number>;
}
//# sourceMappingURL=interviewParticipant.service.d.ts.map