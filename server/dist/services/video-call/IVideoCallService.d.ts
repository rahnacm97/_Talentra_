import { CreateVideoCallDTO, VideoCallResponseDTO } from '../dtos/video-call.dto';
export interface IVideoCallService {
    /**
     * Create a video call for an interview
     */
    createVideoCall(data: CreateVideoCallDTO): Promise<VideoCallResponseDTO>;
    /**
     * Get video call details by room ID
     */
    getVideoCallByRoomId(roomId: string): Promise<VideoCallResponseDTO | null>;
    /**
     * Get video call by interview ID
     */
    getVideoCallByInterviewId(interviewId: string): Promise<VideoCallResponseDTO | null>;
    /**
     * Join a video call
     */
    joinCall(roomId: string, userId: string): Promise<void>;
    /**
     * Leave a video call
     */
    leaveCall(roomId: string, userId: string): Promise<void>;
    /**
     * Start video call (first participant joins)
     */
    startCall(roomId: string): Promise<void>;
    /**
     * End video call (all participants left or manually ended)
     */
    endCall(roomId: string): Promise<void>;
    /**
     * Cancel video call
     */
    cancelCall(roomId: string): Promise<void>;
}
//# sourceMappingURL=IVideoCallService.d.ts.map