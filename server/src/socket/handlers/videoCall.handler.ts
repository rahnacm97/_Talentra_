import { Socket } from "socket.io";
import { IVideoCallService } from "../../interfaces/videoCall/IVideoCallService";
import {
  OfferPayload,
  AnswerPayload,
  CandidatePayload,
} from "../../type/videocall/videocall.types";
import { ISocketHandler } from "../../interfaces/socket/ISocketHandler";

export class VideoCallHandler implements ISocketHandler {
  private roomHosts: Map<string, string> = new Map();

  constructor(private _videoCallService: IVideoCallService) {}

  public handle(socket: Socket): void {
    this.initializeEvents(socket);
  }

  private initializeEvents(socket: Socket) {
    socket.on("join_call", (data) => this.handleJoinCall(socket, data));
    socket.on("request_to_join", (data) =>
      this.handleRequestToJoin(socket, data),
    );
    socket.on("admit_participant", (data) =>
      this.handleAdmitParticipant(socket, data),
    );
    socket.on("deny_participant", (data) =>
      this.handleDenyParticipant(socket, data),
    );

    socket.on("offer", (data) => this.handleOffer(socket, data));
    socket.on("answer", (data) => this.handleAnswer(socket, data));
    socket.on("ice_candidate", (data) => this.handleIceCandidate(socket, data));
    socket.on("end_call", (data) => this.handleEndCall(socket, data));

    socket.on("group_message", (data) => this.handleGroupMessage(socket, data));
  }

  private async handleJoinCall(
    socket: Socket,

    data: { roomId: string; userId: string; isHost?: boolean },
  ) {
    const { roomId, userId, isHost } = data;

    socket.join(roomId);

    if (isHost || !this.roomHosts.has(roomId)) {
      console.log(`Setting host for room ${roomId}: ${socket.id}`);
      this.roomHosts.set(roomId, socket.id);
    }

    console.log(`User ${userId} joined room ${roomId} (Host: ${isHost})`);
    socket.to(roomId).emit("user_joined", userId);
  }

  private handleRequestToJoin(
    socket: Socket,
    data: { roomId: string; userId: string; name: string; userType: string },
  ) {
    console.log(
      `Request to join room ${data.roomId} from ${data.userId} (${data.name})`,
    );
    const hostSocketId = this.roomHosts.get(data.roomId);
    console.log(`Host socket ID for room ${data.roomId}: ${hostSocketId}`);

    if (hostSocketId) {
      console.log(`Emitting participant_waiting to host ${hostSocketId}`);
      socket.to(hostSocketId).emit("participant_waiting", {
        socketId: socket.id,
        userId: data.userId,
        name: data.name,
        userType: data.userType,
      });
    } else {
      console.log(`No host found for room ${data.roomId}`);
    }
  }

  private handleAdmitParticipant(
    socket: Socket,
    data: { socketId: string; roomId: string },
  ) {
    socket.to(data.socketId).emit("participant_admitted", {
      roomId: data.roomId,
    });
  }

  private handleDenyParticipant(
    socket: Socket,
    data: { socketId: string; roomId: string },
  ) {
    socket.to(data.socketId).emit("participant_denied", {
      roomId: data.roomId,
    });
  }

  private handleOffer(socket: Socket, data: OfferPayload) {
    const fromUserId = socket.data.userId;
    const targetedData = { ...data, fromUserId };

    if (data.targetUserId) {
      socket.to(data.targetUserId).emit("offer", targetedData);
    } else {
      socket.to(data.roomId).emit("offer", targetedData);
    }
  }

  private handleAnswer(socket: Socket, data: AnswerPayload) {
    const fromUserId = socket.data.userId;
    const targetedData = { ...data, fromUserId };

    if (data.targetUserId) {
      socket.to(data.targetUserId).emit("answer", targetedData);
    } else {
      socket.to(data.roomId).emit("answer", targetedData);
    }
  }

  private handleIceCandidate(socket: Socket, data: CandidatePayload) {
    const fromUserId = socket.data.userId;
    const targetedData = { ...data, fromUserId };

    if (data.targetUserId) {
      socket.to(data.targetUserId).emit("ice_candidate", targetedData);
    } else {
      socket.to(data.roomId).emit("ice_candidate", targetedData);
    }
  }

  private async handleEndCall(
    socket: Socket,
    data: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = data;
    socket.to(roomId).emit("call_ended", { userId });
    socket.leave(roomId);

    if (this.roomHosts.get(roomId) === socket.id) {
      this.roomHosts.delete(roomId);
    }

    try {
      await this._videoCallService.endCall(roomId);
    } catch (error) {
      console.error("Error logging call end:", error);
    }
  }

  private handleGroupMessage(
    socket: Socket,
    data: { roomId: string; message: string; sender: string },
  ) {
    socket.to(data.roomId).emit("new_message", {
      sender: data.sender,
      message: data.message,
      timestamp: new Date(),
    });
  }
}
