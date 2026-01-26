import { Request, Response, NextFunction } from "express";
import { IMeetingService } from "../../interfaces/meeting/IMeetingService";

export class MeetingController {
  constructor(private _meetingService: IMeetingService) {}

  generateLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { interviewId } = req.body;
      if (!interviewId) {
        throw new Error("Interview ID is required");
      }
      const token = this._meetingService.generateMeetingToken(interviewId);
      // Construct the full URL if needed, or just return the token
      // For now, returning token and let frontend construct the URL
      res.status(200).json({ success: true, token });
    } catch (error) {
      next(error);
    }
  };

  verifyLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("Token is required");
      }
      const data = this._meetingService.verifyMeetingToken(token);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  joinAsGuest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, name } = req.body;
      if (!token || !name) {
        throw new Error("Token and Name are required");
      }
      const result = await this._meetingService.joinAsGuest(token, name);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}
