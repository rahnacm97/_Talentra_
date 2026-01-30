import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  console.log("Initializing socket connection to:", socketUrl);

  // If the URL contains a subpath (like /api), we need to extract the base and set the path option
  const urlStore = new URL(socketUrl || window.location.origin);
  const path = urlStore.pathname === "/" ? "/socket.io" : `${urlStore.pathname.replace(/\/$/, "")}/socket.io`;

  socket = io(urlStore.origin, {
    path: path,
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const updateSocketToken = (token: string): void => {
  if (socket) {
    socket.auth = { token };
    socket.disconnect().connect();
  }
};
