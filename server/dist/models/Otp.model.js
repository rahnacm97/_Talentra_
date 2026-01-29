"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: {
        type: String,
        enum: ["signup", "forgot-password"],
        required: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("Otp", otpSchema);
//# sourceMappingURL=Otp.model.js.map