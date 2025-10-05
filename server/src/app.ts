import express from "express";
import connectDB from "./config/db.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import candidateRoute from "./routes/candidate/candidate.routes"
import authRoute from "./routes/auth/auth.routes";
import adminRoute from "./routes/admin/admin.routes"
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/candidates", candidateRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
