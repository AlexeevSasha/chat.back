import express, { Express } from "express";

export class AppModule {
  port: number;
  app: Express;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT);
  }

  public init() {
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}
