import mongoose, { Document } from "mongoose";
import { IEmployer } from "../users/employer/IEmployer";
import { ICandidate } from "../users/candidate/ICandidate";
export interface IChat extends Document {
    applicationId: string;
    employerId: string | IEmployer;
    candidateId: string | ICandidate;
    jobId: string;
    lastMessage?: string;
    lastMessageAt?: Date;
    messages: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export type ChatWithAggregation = IChat & {
    unreadCount?: number;
};
//# sourceMappingURL=IChat.d.ts.map