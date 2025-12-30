import { Router } from "express";
import { VideoCallController } from "../../controllers/videoCall/videoCall.controller";
import { VideoCallService } from "../../services/videoCall/videoCall.service";
import { VideoCallRepository } from "../../repositories/videoCall/videoCall.repository";

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
  videoCallController.initiateCall.bind(videoCallController),
);
videoCallRouter.post(
  "/end",
  videoCallController.endCall.bind(videoCallController),
);
videoCallRouter.get(
  "/status/:interviewId",
  videoCallController.getCallStatus.bind(videoCallController),
);

export default videoCallRouter;
