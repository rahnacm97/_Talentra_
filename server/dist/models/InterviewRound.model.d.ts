import mongoose, { Document } from "mongoose";
export interface IInterviewRoundDocument extends Document {
    _id: mongoose.Types.ObjectId;
    applicationId: string;
    jobId: string;
    candidateId: string;
    employerId: string;
    roundNumber: number;
    roundType: "technical" | "managerial" | "hr" | "behavioral" | "cultural" | "custom";
    customRoundName?: string;
    scheduledDate?: Date;
    status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled";
    meetingLink: string;
    meetingToken: string;
    duration?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IInterviewRoundDocument, {}, {}, {}, mongoose.Document<unknown, {}, IInterviewRoundDocument, {}, {}> & IInterviewRoundDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=InterviewRound.model.d.ts.map