import { Socket } from "socket.io";

export const socketMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  if (socket.handshake.auth?.id) {
    socket.userID = socket.handshake.auth?.id;
    next();
  } else {
    next(new Error("NOT AUTHORIZED"));
  }
};
