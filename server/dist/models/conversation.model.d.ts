import mongoose, { Document, Types } from 'mongoose';
export interface IConversation extends Document {
    interviewId: Types.ObjectId;
    participants: {
        employer: Types.ObjectId;
        candidate: Types.ObjectId;
    };
    lastMessage?: Types.ObjectId;
    unreadCount: {
        employer: number;
        candidate: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=conversation.model.d.ts.map