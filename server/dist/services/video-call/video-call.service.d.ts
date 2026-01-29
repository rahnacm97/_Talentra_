import { IVideoCallService } from './IVideoCallService';
import { IVideoCallRepository } from '../../repositories/video-call/IVideoCallRepository';
import { INotificationService } from '../notification/INotificationService';
import { CreateVideoCallDTO, VideoCallResponseDTO } from '../../dtos/video-call.dto';
export declare class VideoCallService implements IVideoCallService {
    private videoCallRepository;
    private notificationService;
    constructor(videoCallRepository: IVideoCallRepository, notificationService: INotificationService);
    createVideoCall(data: CreateVideoCallDTO): Promise<VideoCallResponseDTO>;
    getVideoCallByRoomId(roomId: string): Promise<VideoCallResponseDTO | null>;
    getVideoCallByInterviewId(interviewId: string): Promise<VideoCallResponseDTO | null>;
    joinCall(roomId: string, userId: string): Promise<void>;
    leaveCall(roomId: string, userId: string): Promise<void>;
    startCall(roomId: string): Promise<void>;
    endCall(roomId: string): Promise<void>;
    cancelCall(roomId: string): Promise<void>;
}
//# sourceMappingURL=video-call.service.d.ts.map