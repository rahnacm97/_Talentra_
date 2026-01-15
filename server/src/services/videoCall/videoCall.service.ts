import { IVideoCallRepository } from "../../interfaces/videoCall/IVideoCallRepository";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import { IVideoCall } from "../../interfaces/videoCall/IVideoCall";

export class VideoCallService implements IVideoCallService {
  constructor(private readonly _videoCallRepository: IVideoCallRepository) {}

  //Initiating videocall
  async initiateCall(
    interviewId: string,
    participants: string[],
  ): Promise<IVideoCall> {
    const existingCall =
      await this._videoCallRepository.findActiveCall(interviewId);
    if (existingCall) {
      return existingCall;
    }
    return await this._videoCallRepository.createCall(
      interviewId,
      participants,
    );
  }

  //Ending video call
  async endCall(interviewId: string): Promise<IVideoCall | null> {
    return await this._videoCallRepository.endCall(interviewId);
  }

  //Call stattus
  async getCallStatus(interviewId: string): Promise<IVideoCall | null> {
    return await this._videoCallRepository.findActiveCall(interviewId);
  }
}
