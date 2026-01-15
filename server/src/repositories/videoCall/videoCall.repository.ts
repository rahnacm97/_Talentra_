import VideoCallModel from "../../models/VideoCall.model";
import { IVideoCall } from "../../interfaces/videoCall/IVideoCall";
import { IVideoCallRepository } from "../../interfaces/videoCall/IVideoCallRepository";

export class VideoCallRepository implements IVideoCallRepository {
  //Collection create
  async createCall(
    interviewId: string,
    participants: string[],
  ): Promise<IVideoCall> {
    return await VideoCallModel.create({
      interviewId,
      participants,
      status: "active",
      startTime: new Date(),
    });
  }

  //Active call finding
  async findActiveCall(interviewId: string): Promise<IVideoCall | null> {
    return await VideoCallModel.findOne({ interviewId, status: "active" });
  }

  //Undating status to end
  async endCall(interviewId: string): Promise<IVideoCall | null> {
    return await VideoCallModel.findOneAndUpdate(
      { interviewId, status: "active" },
      { status: "ended", endTime: new Date() },
      { new: true },
    );
  }

  //Finding by Id
  async findById(callId: string): Promise<IVideoCall | null> {
    return await VideoCallModel.findById(callId);
  }
}
