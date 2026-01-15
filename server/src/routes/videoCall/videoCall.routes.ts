import { Router } from "express";
import { VideoCallController } from "../../controllers/videoCall/videoCall.controller";
import { VideoCallService } from "../../services/videoCall/videoCall.service";
import { VideoCallRepository } from "../../repositories/videoCall/videoCall.repository";
import { verifyAuth } from "../../middlewares/authMiddleware";
import { USER_ROLES } from "../../shared/enums/enums";

const videoCallRouter = Router();
//Dependency
const videoCallRepository = new VideoCallRepository();
//Service with dependency
const videoCallService = new VideoCallService(videoCallRepository);
//Controller
const videoCallController = new VideoCallController(videoCallService);

//Routes
videoCallRouter.post(
  "/initiate",
  verifyAuth([USER_ROLES.CANDIDATE, USER_ROLES.EMPLOYER]),
  videoCallController.initiateCall.bind(videoCallController),
);
videoCallRouter.post(
  "/end",
  verifyAuth([USER_ROLES.CANDIDATE, USER_ROLES.EMPLOYER]),
  videoCallController.endCall.bind(videoCallController),
);
videoCallRouter.get(
  "/status/:interviewId",
  verifyAuth([USER_ROLES.CANDIDATE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN]),
  videoCallController.getCallStatus.bind(videoCallController),
);

export default videoCallRouter;
