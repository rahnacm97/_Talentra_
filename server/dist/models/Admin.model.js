"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    emailVerified: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
});
exports.default = (0, mongoose_1.model)("Admin", adminSchema);
//# sourceMappingURL=Admin.model.js.map