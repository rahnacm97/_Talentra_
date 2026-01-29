export interface CreateVideoCallDTO {
    interviewId: string;
    participants: Array<{
        userId: string;
        role: 'employer' | 'candidate';
    }>;
}
export interface VideoCallResponseDTO {
    id: string;
    interviewId: string;
    roomId: string;
    participants: Array<{
        userId: string;
        role: 'employer' | 'candidate';
        name: string;
        joinedAt?: Date;
        leftAt?: Date;
    }>;
    maxParticipants: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    createdAt: Date;
}
export interface UpdateParticipantStatusDTO {
    roomId: string;
    userId: string;
    status: 'joined' | 'left';
}
//# sourceMappingURL=video-call.dto.d.ts.map