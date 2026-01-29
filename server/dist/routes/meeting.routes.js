"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meeting_controller_1 = require("../controllers/meeting/meeting.controller");
const meeting_service_1 = require("../services/meeting/meeting.service");
const token_service_1 = require("../services/auth/token.service");
const router = (0, express_1.Router)();
const tokenService = new token_service_1.TokenService();
const meetingService = new meeting_service_1.MeetingService(tokenService);
const meetingController = new meeting_controller_1.MeetingController(meetingService);
router.post("/generate", meetingController.generateLink); // Protected by auth middleware in index/app if applied globally, or add here
router.post("/verify", meetingController.verifyLink);
router.post("/join-guest", meetingController.joinAsGuest);
exports.default = router;
//# sourceMappingURL=meeting.routes.js.map