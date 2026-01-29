import { IVideoCallRepository } from "../../interfaces/videoCall/IVideoCallRepository";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import { IVideoCall } from "../../interfaces/videoCall/IVideoCall";
export declare class VideoCallService implements IVideoCallService {
    private readonly _videoCallRepository;
    constructor(_videoCallRepository: IVideoCallRepository);
    initiateCall(interviewId: string, participants: string[]): Promise<IVideoCall>;
    endCall(interviewId: string): Promise<IVideoCall | null>;
    getCallStatus(interviewId: string): Promise<IVideoCall | null>;
}
//# sourceMappingURL=videoCall.service.d.ts.map