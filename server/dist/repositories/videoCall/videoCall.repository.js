"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCallRepository = void 0;
const VideoCall_model_1 = __importDefault(require("../../models/VideoCall.model"));
class VideoCallRepository {
    //Collection create
    async createCall(interviewId, participants) {
        return await VideoCall_model_1.default.create({
            interviewId,
            participants,
            status: "active",
            startTime: new Date(),
        });
    }
    //Active call finding
    async findActiveCall(interviewId) {
        return await VideoCall_model_1.default.findOne({ interviewId, status: "active" });
    }
    //Undating status to end
    async endCall(interviewId) {
        return await VideoCall_model_1.default.findOneAndUpdate({ interviewId, status: "active" }, { status: "ended", endTime: new Date() }, { new: true });
    }
    //Finding by Id
    async findById(callId) {
        return await VideoCall_model_1.default.findById(callId);
    }
}
exports.VideoCallRepository = VideoCallRepository;
//# sourceMappingURL=videoCall.repository.js.map