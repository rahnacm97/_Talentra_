import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/auth.routes";
import candidateRoutes from "./routes/candidate/candidate.routes";
import employerRoutes from "./routes/employer/employer.routes";
import adminRoutes from "./routes/admin/admin.routes";
import jobRoutes from "./routes/job/job.routes";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, ""],
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
