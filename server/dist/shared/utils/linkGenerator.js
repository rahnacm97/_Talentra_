"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinutesUntilJoin = exports.canJoinMeeting = exports.validateMeetingToken = exports.generateMeetingLink = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateMeetingLink = (roundId) => {
    const secret = process.env.JWT_SECRET || "default_limitless_secret";
    const token = jsonwebtoken_1.default.sign({ interviewId: roundId }, secret, {
        expiresIn: "24h",
    });
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const link = `${clientUrl}/meet/${token}`;
    return { link, token };
};
exports.generateMeetingLink = generateMeetingLink;
const validateMeetingToken = (storedToken, providedToken, scheduledDate) => {
    if (storedToken !== providedToken) {
        return false;
    }
    const now = new Date();
    const validStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
    const validEnd = new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000);
    return now >= validStart && now <= validEnd;
};
exports.validateMeetingToken = validateMeetingToken;
const canJoinMeeting = (scheduledDate) => {
    const now = new Date();
    const joinWindowStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
    return now >= joinWindowStart;
};
exports.canJoinMeeting = canJoinMeeting;
const getMinutesUntilJoin = (scheduledDate) => {
    const now = new Date();
    const joinWindowStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
    const diffMs = joinWindowStart.getTime() - now.getTime();
    return Math.ceil(diffMs / (60 * 1000));
};
exports.getMinutesUntilJoin = getMinutesUntilJoin;
//# sourceMappingURL=linkGenerator.js.map