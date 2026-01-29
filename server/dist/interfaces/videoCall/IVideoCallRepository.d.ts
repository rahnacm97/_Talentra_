import { IVideoCall } from "./IVideoCall";
export interface IVideoCallRepository {
    createCall(interviewId: string, participants: string[]): Promise<IVideoCall>;
    findActiveCall(interviewId: string): Promise<IVideoCall | null>;
    endCall(interviewId: string): Promise<IVideoCall | null>;
    findById(callId: string): Promise<IVideoCall | null>;
}
//# sourceMappingURL=IVideoCallRepository.d.ts.map