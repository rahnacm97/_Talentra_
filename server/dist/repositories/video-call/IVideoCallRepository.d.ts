import { IVideoCall } from '../../models/video-call.model';
import { CreateVideoCallDTO } from '../../dtos/video-call.dto';
export interface IVideoCallRepository {
    /**
     * Create a new video call
     */
    createVideoCall(data: CreateVideoCallDTO): Promise<IVideoCall>;
    /**
     * Find video call by room ID
     */
    findByRoomId(roomId: string): Promise<IVideoCall | null>;
    /**
     * Find video call by interview ID
     */
    findByInterviewId(interviewId: string): Promise<IVideoCall | null>;
    /**
     * Update participant status (joined/left)
     */
    updateParticipantStatus(roomId: string, userId: string, status: 'joined' | 'left'): Promise<void>;
    /**
     * Start video call (update status to ongoing)
     */
    startCall(roomId: string): Promise<void>;
    /**
     * End video call (update status to completed)
     */
    endCall(roomId: string): Promise<void>;
    /**
     * Cancel video call
     */
    cancelCall(roomId: string): Promise<void>;
    /**
     * Find video call by ID
     */
    findById(videoCallId: string): Promise<IVideoCall | null>;
}
//# sourceMappingURL=IVideoCallRepository.d.ts.map