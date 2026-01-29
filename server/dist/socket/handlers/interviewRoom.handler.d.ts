import { Server, Socket } from "socket.io";
interface ParticipantInfo {
    userId: string;
    socketId: string;
    name: string;
    email: string;
    role: "interviewer" | "panelist" | "observer" | "candidate";
}
interface RoomState {
    roomId: string;
    participants: Map<string, ParticipantInfo>;
    maxParticipants: number;
}
export declare class InterviewRoomHandler {
    private rooms;
    private io;
    initialize(io: Server): void;
    handleConnection(socket: Socket): void;
    private handleLeaveRoom;
    getRoomState(roomId: string): RoomState | undefined;
    getParticipantCount(roomId: string): number;
}
export declare const interviewRoomHandler: InterviewRoomHandler;
export {};
//# sourceMappingURL=interviewRoom.handler.d.ts.map