"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallService = void 0;
class VideoCallService {
    constructor(_videoCallRepository) {
        this._videoCallRepository = _videoCallRepository;
    }
    //Initiating videocall
    async initiateCall(interviewId, participants) {
        const existingCall = await this._videoCallRepository.findActiveCall(interviewId);
        if (existingCall) {
            return existingCall;
        }
        return await this._videoCallRepository.createCall(interviewId, participants);
    }
    //Ending video call
    async endCall(interviewId) {
        return await this._videoCallRepository.endCall(interviewId);
    }
    //Call stattus
    async getCallStatus(interviewId) {
        return await this._videoCallRepository.findActiveCall(interviewId);
    }
}
exports.VideoCallService = VideoCallService;
//# sourceMappingURL=videoCall.service.js.map