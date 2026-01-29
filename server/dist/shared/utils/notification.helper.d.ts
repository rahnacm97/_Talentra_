import { CreateNotificationDto } from "../../dto/notification/notification.dto";
export declare class NotificationHelper {
    private static _instance;
    private _notificationService;
    private constructor();
    static getInstance(): NotificationHelper;
    createAndEmit(dto: CreateNotificationDto): Promise<void>;
    notifyAdminEmployerVerificationSubmitted(employerId: string, employerName: string): Promise<void>;
    notifyEmployerVerificationApproved(employerId: string): Promise<void>;
    notifyEmployerVerificationRejected(employerId: string, reason?: string): Promise<void>;
    notifyEmployerNewApplication(employerId: string, candidateName: string, jobTitle: string, jobId: string, applicationId: string): Promise<void>;
    notifyCandidateApplicationStatusChange(candidateId: string, status: string, jobTitle: string, jobId: string, applicationId: string, companyName: string): Promise<void>;
    notifyCandidateInterviewScheduled(candidateId: string, jobTitle: string, interviewDate: string, interviewId: string): Promise<void>;
    notifyAdminNewFeedback(userId: string, userName: string): Promise<void>;
    emitUserBlocked(userId: string, userType: "Candidate" | "Employer"): void;
    emitUserUnblocked(userId: string, userType: "Candidate" | "Employer"): void;
}
//# sourceMappingURL=notification.helper.d.ts.map