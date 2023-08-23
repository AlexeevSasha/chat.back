import { Server, Socket } from "socket.io";
import { Server as ServerHttp } from "http";
import { socketMiddleware } from "../middleware/socketMiddleware";

export class SocketModule {
  private socket: Server;
  private readonly users: Map<string, { userID: string }>;

  constructor(server: ServerHttp) {
    this.socket = new Server(server, {
      cors: { origin: String(process.env.CLIENT_URL) },
    });
    this.useMiddleware();
    this.users = new Map();
  }

  private useMiddleware() {
    this.socket.use((socket, next) => {
      socketMiddleware(socket, next);
    });
  }

  private connectedUser(socket: Socket) {
    this.users.set(socket.id, { userID: String(socket.userID) });
  }

  private disconnectUser(socket: Socket) {
    this.users.delete(socket.id);
  }

  connect() {
    this.socket.on("connection", (socket) => {
      console.log("socket connected", socket.id);
      this.connectedUser(socket);
      socket.on("disconnect", () => this.disconnectUser(socket));
    });
  }
}
