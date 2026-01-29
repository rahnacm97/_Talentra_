import { Document, Types } from "mongoose";
export interface IInterview extends Document {
    applicationId: Types.ObjectId;
    jobId: Types.ObjectId;
    candidateId: Types.ObjectId;
    employerId: Types.ObjectId;
    interviewDate: Date;
    duration?: number;
    type: "hr" | "technical" | "final" | "behavioral" | "case_study" | "other";
    stage: number;
    interviewers: Types.ObjectId[];
    location?: string;
    meetingLink?: string;
    status: "scheduled" | "completed" | "canceled" | "no-show" | "rescheduled";
    outcome?: "advance" | "reject" | "hired" | "on-hold";
    feedback?: string;
    rating?: number;
    notes?: string;
    scheduledBy: Types.ObjectId;
}
//# sourceMappingURL=IInterview.d.ts.map