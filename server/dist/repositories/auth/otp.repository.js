"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const Otp_model_1 = __importDefault(require("../../models/Otp.model"));
class OtpRepository {
    async createOtp(data) {
        return await Otp_model_1.default.create(data);
    }
    async findOtp(email, purpose) {
        return await Otp_model_1.default.findOne({ email, purpose }).sort({ createdAt: -1 });
    }
    async deleteOtp(email, purpose) {
        await Otp_model_1.default.deleteMany({ email, purpose });
    }
}
exports.OtpRepository = OtpRepository;
//# sourceMappingURL=otp.repository.js.map