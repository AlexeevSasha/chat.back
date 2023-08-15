import { Router } from "express";
import { AuthController } from "./auth.controller";
import { pathRouter } from "../helpers/pathRouter";
import { authMiddleware } from "../middleware/authMiddleware";
import { refreshMiddleware } from "../middleware/refreshMiddleware";

export class AuthModule {
  private readonly routers: Router;
  private readonly authController: AuthController;

  constructor() {
    this.routers = Router();
    this.authController = new AuthController();
  }

  bind(func: Function) {
    return func.bind(this.authController);
  }

  getRouter() {
    this.routers.route(pathRouter.auth.login).post(this.bind(this.authController.login));
    this.routers.route(pathRouter.auth.register).post(this.bind(this.authController.register));
    this.routers.route(pathRouter.auth.logout).get(authMiddleware, this.bind(this.authController.logout));
    this.routers.route(pathRouter.auth.refresh).get(refreshMiddleware, this.bind(this.authController.refresh));
    return this.routers;
  }
}
