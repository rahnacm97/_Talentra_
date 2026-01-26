import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/auth.routes";
import candidateRoutes from "./routes/candidate/candidate.routes";
import employerRoutes from "./routes/employer/employer.routes";
import adminRoutes from "./routes/admin/admin.routes";
import subscriptionRoutes from "./routes/subscription/subscription.routes";
import homepageRoutes from "./routes/homepage/homepage.routes";
import jobRoutes from "./routes/job/job.routes";
// import notificationRoutes from "./routes/notification/notification.routes";
// import chatRoutes from "./routes/chat/chat.routes";
// import videoCallRoutes from "./routes/videoCall/videoCall.routes";
// import aiRoutes from "./routes/ai/ai.routes";
import feedbackRoutes from "./routes/feedback/feedback.routes";
import { interviewRoutes } from "./routes/interview/interview.routes";
import meetingRoutes from "./routes/meeting.routes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
// import { NotificationSocket } from "./socket/notification.socket";
// import { ChatSocket } from "./socket/chat.socket";
// import { SocketManager } from "./socket/socket.manager";
// import { chatHandler, videoCallHandler } from "./socket/handlers/handler";

const app = express();
const server = http.createServer(app);
dotenv.config();

//Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
  },
});

//Initialize socket services
// export const notificationSocket = NotificationSocket.getInstance();
// notificationSocket.initialize(io);

// export const chatSocket = ChatSocket.getInstance();
// chatSocket.initialize(io);

//Initialize Socket Manager
// SocketManager.initialize(io, [chatHandler, videoCallHandler]);

//Application level middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/public", homepageRoutes);
app.use("/api/jobs", jobRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/video-call", videoCallRoutes);
// app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/meeting", meetingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
