export interface IInterviewRound {
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
export type RoundStatus = "pending" | "scheduled" | "in-progress" | "completed" | "cancelled";
export interface IParticipant {
    userId: string;
    role: "interviewer" | "panelist" | "observer";
    name: string;
    email: string;
}
export interface IFeedback {
    interviewerId: string;
    interviewerName: string;
    rating: number;
    comments: string;
    recommendation: "proceed" | "hold" | "reject";
    submittedAt: Date;
}
export interface IInterviewRoundQuery {
    page?: number;
    limit?: number;
    status?: RoundStatus | "all";
    interviewId?: string;
    applicationId?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}
export interface IInterviewRoundWithDetails extends IInterviewRound {
    application: {
        candidateName: string;
        jobTitle: string;
    };
    interview: {
        totalRounds: number;
        roundsCompleted: number;
    };
}
//# sourceMappingURL=IInterviewRound.d.ts.map