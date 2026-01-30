"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
class MeetingService {
    constructor(_tokenService) {
        this._tokenService = _tokenService;
        this._secret = process.env.JWT_SECRET || "default_limitless_secret";
    }
    generateMeetingToken(interviewId) {
        return jsonwebtoken_1.default.sign({ interviewId }, this._secret, { expiresIn: "24h" });
    }
    verifyMeetingToken(token) {
        try {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(token);
            if (isObjectId) {
                return { interviewId: token };
            }
            const decoded = jsonwebtoken_1.default.verify(token, this._secret);
            return { interviewId: decoded.interviewId };
        }
        catch (error) {
            console.error(error);
            throw new Error("Invalid or expired meeting link");
        }
    }
    async joinAsGuest(token, name) {
        const { interviewId } = this.verifyMeetingToken(token);
        const guestId = `guest_${(0, uuid_1.v4)()}`;
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
exports.MeetingService = MeetingService;
//# sourceMappingURL=meeting.service.js.map