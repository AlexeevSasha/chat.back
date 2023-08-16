import express, { Express } from "express";
import { json } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorHandlerMiddleware } from "../middleware/errorMiddleware";
import { AuthModule } from "../auth/auth.module";
import { NotFoundError } from "../error/error";

export class AppModule {
  port: number;
  app: Express;
  globalPrefix = "/api";

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT);
  }

  private useMiddleware() {
    this.app.use(json());
    this.app.use(cors({ origin: [String(process.env.CLIENT_URL)], credentials: true }));
    this.app.use(cookieParser());
  }

  private useRoutes() {
    this.app.use(`${this.globalPrefix}/auth`, new AuthModule().getRouter());
    this.app.use("*", () => {
      throw new NotFoundError("Not found");
    });
  }

  public init() {
    this.useMiddleware();
    this.useRoutes();
    this.app.use(ErrorHandlerMiddleware);
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}
