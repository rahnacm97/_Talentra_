export interface IInterview {
    id: string;
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    interviewDate?: Date;
    status: InterviewStatus;
    notes?: string;
    feedback?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "rescheduled" | "hired" | "rejected";
export interface IInterviewQuery {
    page?: number;
    limit?: number;
    status?: InterviewStatus | "all";
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}
export interface IInterviewWithDetails extends IInterview {
    job: {
        title: string;
        location: string;
        type: string;
    };
    candidate: {
        fullName: string;
        email: string;
        phone: string;
        profileImage?: string;
    };
    employer: {
        name: string;
        companyName: string;
        logo?: string;
    };
    applicationStatus?: string;
}
export interface IInterviewFeedback {
    id: string;
    roundId: string;
    applicationId: string;
    providedBy: string;
    rating: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation: FeedbackRecommendation;
    technicalSkills?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
    isSharedWithCandidate: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type FeedbackRecommendation = "proceed" | "hold" | "reject";
export interface IFeedbackWithProvider extends IInterviewFeedback {
    provider: {
        name: string;
        email: string;
        profileImage?: string;
        role: string;
    };
}
export interface IFeedbackSummary {
    roundId: string;
    totalFeedback: number;
    averageRating: number;
    recommendations: {
        proceed: number;
        hold: number;
        reject: number;
    };
}
export interface IInterviewRound {
    id: string;
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    roundNumber: number;
    roundType: "technical" | "managerial" | "hr" | "behavioral" | "cultural" | "custom";
    customRoundName?: string;
    scheduledDate?: Date;
    status: InterviewRoundStatus;
    meetingLink: string;
    meetingToken: string;
    duration?: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type InterviewRoundStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled";
export interface IInterviewRoundWithDetails extends IInterviewRound {
    job: {
        title: string;
        location: string;
        type: string;
    };
    candidate: {
        fullName: string;
        email: string;
        phone: string;
        profileImage?: string;
    };
    employer: {
        name: string;
        companyName: string;
        logo?: string;
    };
    participantCount?: number;
    feedbackCount?: number;
}
export interface IInterviewRoundQuery {
    page?: number;
    limit?: number;
    status?: InterviewRoundStatus | "all";
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    applicationId?: string;
}
//# sourceMappingURL=IInterview.d.ts.map