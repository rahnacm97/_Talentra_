import mongoose, { Document, Types } from 'mongoose';
export interface IVideoCallParticipant {
    userId: Types.ObjectId;
    role: 'employer' | 'candidate';
    joinedAt?: Date;
    leftAt?: Date;
}
export interface IVideoCall extends Document {
    interviewId: Types.ObjectId;
    roomId: string;
    participants: IVideoCallParticipant[];
    maxParticipants: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VideoCall: mongoose.Model<IVideoCall, {}, {}, {}, mongoose.Document<unknown, {}, IVideoCall, {}, {}> & IVideoCall & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=video-call.model.d.ts.map