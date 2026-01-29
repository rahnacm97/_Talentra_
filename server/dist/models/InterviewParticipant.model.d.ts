import mongoose, { Document } from "mongoose";
export interface IInterviewParticipantDocument extends Document {
    _id: mongoose.Types.ObjectId;
    roundId: string;
    userId: string;
    role: "candidate" | "interviewer" | "panelist" | "observer";
    name: string;
    email: string;
    joinedAt?: Date;
    leftAt?: Date;
    connectionStatus: "connected" | "disconnected" | "reconnecting";
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IInterviewParticipantDocument, {}, {}, {}, mongoose.Document<unknown, {}, IInterviewParticipantDocument, {}, {}> & IInterviewParticipantDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=InterviewParticipant.model.d.ts.map