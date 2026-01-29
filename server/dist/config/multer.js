"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
//File upload
const storage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedResumeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if ((file.fieldname === "resume" &&
        allowedResumeTypes.includes(file.mimetype)) ||
        (file.fieldname === "profileImage" &&
            allowedImageTypes.includes(file.mimetype)) ||
        (file.fieldname === "businessLicense" &&
            allowedResumeTypes.includes(file.mimetype))) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
//# sourceMappingURL=multer.js.map