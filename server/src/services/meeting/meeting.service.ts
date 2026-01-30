import jwt from "jsonwebtoken";
import {
  IMeetingService,
  GuestUser,
} from "../../interfaces/meeting/IMeetingService";
import { ITokenService } from "../../interfaces/auth/ITokenService";
import { v4 as uuidv4 } from "uuid";

export class MeetingService implements IMeetingService {
  private readonly _secret: string;

  constructor(private _tokenService: ITokenService) {
    this._secret = process.env.JWT_SECRET || "default_limitless_secret";
  }

  generateMeetingToken(interviewId: string): string {
    return jwt.sign({ interviewId }, this._secret, { expiresIn: "24h" });
  }

  verifyMeetingToken(token: string): { interviewId: string } {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(token);
      if (isObjectId) {
        return { interviewId: token };
      }
      const decoded = jwt.verify(token, this._secret) as {
        interviewId: string;
      };
      return { interviewId: decoded.interviewId };
    } catch (error) {
      console.error(error);
      throw new Error("Invalid or expired meeting link");
    }
  }

  async joinAsGuest(
    token: string,
    name: string,
  ): Promise<{ accessToken: string; user: GuestUser }> {
    const { interviewId } = this.verifyMeetingToken(token);

    const guestId = `guest_${uuidv4()}`;
    const guestUser = {
      _id: guestId,
      name: name,
      email: `guest_${guestId}@temp.com`,
      role: "Guest",
      isGuest: true,
      interviewId,
    };

    const accessToken = this._tokenService.generateAccessToken({
      id: guestUser._id,
      email: guestUser.email,
      role: "Guest",
    });

    return {
      accessToken,
      user: guestUser,
    };
  }
}
