import mongoose, { Document } from "mongoose";
export interface IInterviewFeedbackDocument extends Document {
    _id: mongoose.Types.ObjectId;
    roundId: string;
    applicationId: string;
    providedBy: string;
    rating: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation: "proceed" | "hold" | "reject";
    technicalSkills?: number;
    communication?: number;
    problemSolving?: number;
    culturalFit?: number;
    isSharedWithCandidate: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IInterviewFeedbackDocument, {}, {}, {}, mongoose.Document<unknown, {}, IInterviewFeedbackDocument, {}, {}> & IInterviewFeedbackDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=InterviewFeedback.model.d.ts.map