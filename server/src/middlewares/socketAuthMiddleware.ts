import { Socket } from "socket.io";
import { TokenService } from "../services/auth/token.service";

const tokenService = new TokenService();

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = tokenService.verifyAccessToken(token) as {
      id: string;
      role: string;
    };

    socket.data.userId = decoded.id;
    socket.data.role = decoded.role;

    next();
  } catch (err) {
    console.error("Socket authentication failed:", err);
    next(new Error("Authentication error: Invalid token"));
  }
};
