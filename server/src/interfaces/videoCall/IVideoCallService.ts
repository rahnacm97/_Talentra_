import { IVideoCall } from "./IVideoCall";

export interface IVideoCallService {
  initiateCall(
    interviewId: string,
    participants: string[],
  ): Promise<IVideoCall>;
  endCall(interviewId: string): Promise<IVideoCall | null>;
  getCallStatus(interviewId: string): Promise<IVideoCall | null>;
}
