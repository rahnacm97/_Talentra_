import { Socket } from "socket.io";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import { ISocketHandler } from "../../interfaces/socket/ISocketHandler";
export declare class VideoCallHandler implements ISocketHandler {
    private _videoCallService;
    private roomHosts;
    constructor(_videoCallService: IVideoCallService);
    handle(socket: Socket): void;
    private initializeEvents;
    private handleJoinCall;
    private handleRequestToJoin;
    private handleAdmitParticipant;
    private handleDenyParticipant;
    private handleOffer;
    private handleAnswer;
    private handleIceCandidate;
    private handleEndCall;
    private handleGroupMessage;
}
//# sourceMappingURL=videoCall.handler.d.ts.map