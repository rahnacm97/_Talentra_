import { IMeetingService, GuestUser } from "../../interfaces/meeting/IMeetingService";
import { ITokenService } from "../../interfaces/auth/ITokenService";
export declare class MeetingService implements IMeetingService {
    private _tokenService;
    private readonly _secret;
    constructor(_tokenService: ITokenService);
    generateMeetingToken(interviewId: string): string;
    verifyMeetingToken(token: string): {
        interviewId: string;
    };
    joinAsGuest(token: string, name: string): Promise<{
        accessToken: string;
        user: GuestUser;
    }>;
}
//# sourceMappingURL=meeting.service.d.ts.map