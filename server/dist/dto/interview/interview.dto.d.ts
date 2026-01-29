import { InterviewStatus, InterviewRoundStatus } from "../../interfaces/interviews/IInterview";
export interface InterviewResponseDto {
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
export interface InterviewWithDetailsDto {
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
}
export interface InterviewsPaginatedDto {
    interviews: InterviewWithDetailsDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class InterviewFeedbackResponseDto {
    id: string;
    roundId: string;
    applicationId: string;
    providedBy: string;
    rating: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation: string;
    technicalSkills?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
    isSharedWithCandidate: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export declare class FeedbackWithProviderDto extends InterviewFeedbackResponseDto {
    provider: {
        name: string;
        email: string;
        profileImage?: string;
        role: string;
    };
}
export declare class FeedbackSummaryDto {
    roundId: string;
    totalFeedback: number;
    averageRating: number;
    recommendations: {
        proceed: number;
        hold: number;
        reject: number;
    };
}
export declare class SubmitFeedbackDto {
    applicationId: string;
    providedBy: string;
    rating: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation: string;
    technicalSkills?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
}
export declare class UpdateFeedbackDto {
    rating?: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation?: string;
    technicalSkills?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
}
export declare class InterviewParticipantResponseDto {
    id: string;
    roundId: string;
    userId: string;
    role: string;
    name: string;
    email: string;
    joinedAt?: string;
    leftAt?: string;
    connectionStatus: string;
    createdAt?: string;
    updatedAt?: string;
}
export declare class AddParticipantDto {
    userId: string;
    role: string;
    name: string;
    email: string;
}
export declare class UpdateParticipantStatusDto {
    status: string;
}
export declare class InterviewRoundResponseDto {
    id: string;
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    roundNumber: number;
    roundType: string;
    customRoundName?: string;
    scheduledDate?: string;
    status: InterviewRoundStatus;
    meetingLink: string;
    duration?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}
export declare class InterviewRoundWithDetailsDto extends InterviewRoundResponseDto {
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
export declare class CreateRoundDto {
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    roundNumber: number;
    roundType: string;
    customRoundName?: string;
    scheduledDate?: string;
    duration?: number;
    notes?: string;
}
export declare class UpdateRoundStatusDto {
    status: string;
}
export declare class RescheduleRoundDto {
    newDate: string;
}
export declare class CancelRoundDto {
    reason?: string;
}
//# sourceMappingURL=interview.dto.d.ts.map