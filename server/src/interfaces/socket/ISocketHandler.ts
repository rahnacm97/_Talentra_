import { Socket } from "socket.io";

export interface ISocketHandler {
  handle(socket: Socket): void;
}
