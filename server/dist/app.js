"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = exports.notificationSocket = void 0;
const express_1 = __importDefault(require("express"));
const db_config_1 = __importDefault(require("./config/db.config"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate/candidate.routes"));
const employer_routes_1 = __importDefault(require("./routes/employer/employer.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin/admin.routes"));
const job_routes_1 = __importDefault(require("./routes/job/job.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification/notification.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat/chat.routes"));
const videoCall_routes_1 = __importDefault(require("./routes/videoCall/videoCall.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai/ai.routes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback/feedback.routes"));
const interview_routes_1 = require("./routes/interview/interview.routes");
const meeting_routes_1 = __importDefault(require("./routes/meeting.routes"));
const offer_routes_1 = __importDefault(require("./routes/offer/offer.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const notification_socket_1 = require("./socket/notification.socket");
const chat_socket_1 = require("./socket/chat.socket");
const socket_manager_1 = require("./socket/socket.manager");
const handler_1 = require("./socket/handlers/handler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
//Socket.io setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
        credentials: true,
    },
});
//Initialize socket services
exports.notificationSocket = notification_socket_1.NotificationSocket.getInstance();
exports.notificationSocket.initialize(io);
exports.chatSocket = chat_socket_1.ChatSocket.getInstance();
exports.chatSocket.initialize(io);
//Initialize Socket Manager
socket_manager_1.SocketManager.initialize(io, [handler_1.chatHandler, handler_1.videoCallHandler]);
//Application level middlewares
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
(0, db_config_1.default)();
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/candidate", candidate_routes_1.default);
app.use("/api/employer", employer_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/jobs", job_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/video-call", videoCall_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/feedback", feedback_routes_1.default);
app.use("/api/interviews", interview_routes_1.interviewRoutes);
app.use("/api/meeting", meeting_routes_1.default);
app.use("/api/offers", offer_routes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=app.js.map