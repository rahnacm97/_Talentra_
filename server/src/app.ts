import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/auth.routes";
import candidateRoutes from "./routes/candidate/candidate.routes";
import employerRoutes from "./routes/employer/employer.routes";
import adminRoutes from "./routes/admin/admin.routes";
import jobRoutes from "./routes/job/job.routes";
import notificationRoutes from "./routes/notification/notification.routes";
import chatRoutes from "./routes/chat/chat.routes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { NotificationSocket } from "./socket/notification.socket";
import { ChatSocket } from "./socket/chat.socket";
import { SocketManager } from "./socket/socket.manager";

const app = express();
const server = http.createServer(app);
dotenv.config();

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
  },
});

// Initialize Socket Manager
SocketManager.initialize(io);

export const notificationSocket = NotificationSocket.getInstance();
export const chatSocket = ChatSocket.getInstance();

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
app.use("/api/jobs", jobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
