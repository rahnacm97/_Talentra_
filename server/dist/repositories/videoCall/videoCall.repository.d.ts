import { IVideoCall } from "../../interfaces/videoCall/IVideoCall";
import { IVideoCallRepository } from "../../interfaces/videoCall/IVideoCallRepository";
export declare class VideoCallRepository implements IVideoCallRepository {
    createCall(interviewId: string, participants: string[]): Promise<IVideoCall>;
    findActiveCall(interviewId: string): Promise<IVideoCall | null>;
    endCall(interviewId: string): Promise<IVideoCall | null>;
    findById(callId: string): Promise<IVideoCall | null>;
}
//# sourceMappingURL=videoCall.repository.d.ts.map