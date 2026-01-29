import { IVideoCallRepository } from './IVideoCallRepository';
import { IVideoCall } from '../../models/video-call.model';
import { CreateVideoCallDTO } from '../../dtos/video-call.dto';
export declare class VideoCallRepository implements IVideoCallRepository {
    createVideoCall(data: CreateVideoCallDTO): Promise<IVideoCall>;
    findByRoomId(roomId: string): Promise<IVideoCall | null>;
    findByInterviewId(interviewId: string): Promise<IVideoCall | null>;
    updateParticipantStatus(roomId: string, userId: string, status: 'joined' | 'left'): Promise<void>;
    startCall(roomId: string): Promise<void>;
    endCall(roomId: string): Promise<void>;
    cancelCall(roomId: string): Promise<void>;
    findById(videoCallId: string): Promise<IVideoCall | null>;
}
//# sourceMappingURL=video-call.repository.d.ts.map