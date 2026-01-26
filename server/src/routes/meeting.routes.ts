import { Router } from "express";
import { MeetingController } from "../controllers/meeting/meeting.controller";
import { MeetingService } from "../services/meeting/meeting.service";
import { TokenService } from "../services/auth/token.service";

const router = Router();

const tokenService = new TokenService();
const meetingService = new MeetingService(tokenService);
const meetingController = new MeetingController(meetingService);

router.post("/generate", meetingController.generateLink); // Protected by auth middleware in index/app if applied globally, or add here
router.post("/verify", meetingController.verifyLink);
router.post("/join-guest", meetingController.joinAsGuest);

export default router;
