"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCall = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VideoCallParticipantSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'role',
    },
    role: {
        type: String,
        enum: ['employer', 'candidate'],
        required: true,
    },
    joinedAt: Date,
    leftAt: Date,
}, { _id: false });
const VideoCallSchema = new mongoose_1.Schema({
    interviewId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    participants: [VideoCallParticipantSchema],
    maxParticipants: {
        type: Number,
        default: 3,
        min: 2,
        max: 3,
    },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number,
}, {
    timestamps: true,
});
// Indexes for efficient queries
VideoCallSchema.index({ interviewId: 1 });
VideoCallSchema.index({ status: 1 });
VideoCallSchema.index({ 'participants.userId': 1 });
// Pre-save hook to calculate duration
VideoCallSchema.pre('save', function (next) {
    if (this.startedAt && this.endedAt) {
        this.duration = Math.floor((this.endedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    next();
});
exports.VideoCall = mongoose_1.default.model('VideoCall', VideoCallSchema);
//# sourceMappingURL=video-call.model.js.map