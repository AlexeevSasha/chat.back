import express, { Express } from "express";
import { json } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorHandlerMiddleware } from "../middleware/errorMiddleware";
import { AuthModule } from "../auth/auth.module";
import { NotFoundError } from "../error/error";
import http from "http";
import { SocketModule } from "../socket/socket.module";
import { FriendModule } from "../friend/friend.module";

export class AppModule {
  port: number;
  app: Express;
  server: http.Server;
  globalPrefix = "/api";

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = Number(process.env.PORT);
  }

  private useMiddleware() {
    this.app.use(json());
    this.app.use(cors({ origin: [String(process.env.CLIENT_URL)], credentials: true }));
    this.app.use(cookieParser());
  }

  private useRoutes() {
    this.app.use(`${this.globalPrefix}/auth`, new AuthModule().getRouter());
    this.app.use(`${this.globalPrefix}/friend`, new FriendModule().getRouter());
    this.app.use("*", () => {
      throw new NotFoundError("Not found");
    });
  }

  private socketConnect() {
    new SocketModule(this.server).connect();
  }

  public init() {
    this.useMiddleware();
    this.useRoutes();
    this.app.use(ErrorHandlerMiddleware);
    this.socketConnect();
    this.server.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}
