import { IInterviewRoundService } from "../../interfaces/interviews/IInterviewService";
import { IInterviewRoundRepository, IInterviewRepository } from "../../interfaces/interviews/IInterviewRepository";
import { IInterviewRound, IInterviewRoundWithDetails, IInterviewRoundQuery } from "../../interfaces/interviews/IInterview";
import { INotificationService } from "../../interfaces/shared/INotificationService";
export declare class InterviewRoundService implements IInterviewRoundService {
    private readonly _repository;
    private readonly _interviewRepository;
    private readonly _notificationService;
    constructor(_repository: IInterviewRoundRepository, _interviewRepository: IInterviewRepository, _notificationService: INotificationService);
    createRound(applicationId: string, roundData: {
        jobId: string;
        candidateId: string;
        employerId: string;
        roundNumber: number;
        roundType: string;
        customRoundName?: string;
        scheduledDate?: string;
        duration?: number;
        notes?: string;
    }): Promise<IInterviewRoundWithDetails>;
    getRoundById(roundId: string): Promise<IInterviewRoundWithDetails | null>;
    getRoundsForApplication(applicationId: string, query?: IInterviewRoundQuery): Promise<IInterviewRoundWithDetails[]>;
    getRoundsForCandidate(candidateId: string, query?: IInterviewRoundQuery): Promise<{
        rounds: IInterviewRoundWithDetails[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRoundsForEmployer(employerId: string, query?: IInterviewRoundQuery): Promise<{
        rounds: IInterviewRoundWithDetails[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateRoundStatus(roundId: string, status: string): Promise<IInterviewRound | null>;
    rescheduleRound(roundId: string, newDate: string): Promise<IInterviewRound | null>;
    cancelRound(roundId: string, reason?: string): Promise<IInterviewRound | null>;
    validateMeetingAccess(roundId: string, token: string): Promise<{
        valid: boolean;
        round?: IInterviewRoundWithDetails;
    }>;
    checkAllRoundsComplete(applicationId: string): Promise<boolean>;
    deleteRound(roundId: string): Promise<boolean>;
    private _syncParentInterview;
}
//# sourceMappingURL=interviewRound.service.d.ts.map