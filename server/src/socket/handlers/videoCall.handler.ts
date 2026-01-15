import { Socket } from "socket.io";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import {
  OfferPayload,
  AnswerPayload,
  CandidatePayload,
} from "../../type/videocall/videocall.types";
import { ISocketHandler } from "../../interfaces/socket/ISocketHandler";

export class VideoCallHandler implements ISocketHandler {
  constructor(private _videoCallService: IVideoCallService) {}

  public handle(socket: Socket): void {
    this.initializeEvents(socket);
  }

  private initializeEvents(socket: Socket) {
    console.log(
      `Socket Initializing VideoCall events for socket: ${socket.id}`,
    );

    socket.on("join_call", (data) => this.handleJoinCall(socket, data));
    socket.on("offer", (data) => this.handleOffer(socket, data));
    socket.on("answer", (data) => this.handleAnswer(socket, data));
    socket.on("ice_candidate", (data) => this.handleIceCandidate(socket, data));
    socket.on("end_call", (data) => this.handleEndCall(socket, data));
  }

  private async handleJoinCall(
    socket: Socket,
    data: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = data;
    socket.join(roomId);
    socket.to(roomId).emit("user_joined", userId);
    console.log(`User ${userId} joined call room ${roomId}`);
  }

  private handleOffer(socket: Socket, data: OfferPayload) {
    socket.to(data.roomId).emit("offer", data);
  }

  private handleAnswer(socket: Socket, data: AnswerPayload) {
    socket.to(data.roomId).emit("answer", data);
  }

  private handleIceCandidate(socket: Socket, data: CandidatePayload) {
    socket.to(data.roomId).emit("ice_candidate", data.candidate);
  }

  private async handleEndCall(
    socket: Socket,
    data: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = data;
    socket.to(roomId).emit("call_ended", { userId });
    socket.leave(roomId);
    console.log(`User ${userId} ended call in room ${roomId}`);

    try {
      await this._videoCallService.endCall(roomId);
    } catch (error) {
      console.error("Error logging call end:", error);
    }
  }
}
