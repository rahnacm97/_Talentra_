import mongoose, { Schema } from "mongoose";
import { IVideoCall } from "../interfaces/videoCall/IVideoCall";

const VideoCallSchema = new Schema<IVideoCall>(
  {
    interviewId: { type: String, required: true, ref: "Interview" },
    participants: [{ type: String, required: true }],
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    status: { type: String, enum: ["active", "ended"], default: "active" },
  },
  { timestamps: true },
);

export default mongoose.model<IVideoCall>("VideoCall", VideoCallSchema);
