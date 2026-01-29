import { Document } from "mongoose";
export interface IVideoCall extends Document {
    interviewId: string;
    participants: string[];
    startTime: Date;
    endTime?: Date;
    status: "active" | "ended";
}
//# sourceMappingURL=IVideoCall.d.ts.map