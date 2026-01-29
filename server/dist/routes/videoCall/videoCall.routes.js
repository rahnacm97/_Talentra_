"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoCall_controller_1 = require("../../controllers/videoCall/videoCall.controller");
const videoCall_service_1 = require("../../services/videoCall/videoCall.service");
const videoCall_repository_1 = require("../../repositories/videoCall/videoCall.repository");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const enums_1 = require("../../shared/enums/enums");
const videoCallRouter = (0, express_1.Router)();
//Dependency
const videoCallRepository = new videoCall_repository_1.VideoCallRepository();
//Service with dependency
const videoCallService = new videoCall_service_1.VideoCallService(videoCallRepository);
//Controller
const videoCallController = new videoCall_controller_1.VideoCallController(videoCallService);
//Routes
videoCallRouter.post("/initiate", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER]), videoCallController.initiateCall.bind(videoCallController));
videoCallRouter.post("/end", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER]), videoCallController.endCall.bind(videoCallController));
videoCallRouter.get("/status/:interviewId", (0, authMiddleware_1.verifyAuth)([enums_1.USER_ROLES.CANDIDATE, enums_1.USER_ROLES.EMPLOYER, enums_1.USER_ROLES.ADMIN]), videoCallController.getCallStatus.bind(videoCallController));
exports.default = videoCallRouter;
//# sourceMappingURL=videoCall.routes.js.map