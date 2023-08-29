import { Router } from "express";
import { pathRouter } from "../helpers/pathRouter";
import { FriendController } from "./friend.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export class FriendModule {
  private readonly routers: Router;
  private readonly friendController: FriendController;

  constructor() {
    this.routers = Router();
    this.friendController = new FriendController();
  }

  bind(func: Function) {
    return func.bind(this.friendController);
  }

  getRouter() {
    this.routers.route(pathRouter.friend.invite).post(authMiddleware, this.bind(this.friendController.invite));
    this.routers.route(pathRouter.friend.invite).get(authMiddleware, this.bind(this.friendController.getAllInvite));
    this.routers.route(pathRouter.friend.accept).get(authMiddleware, this.bind(this.friendController.accept));
    this.routers.route(pathRouter.friend.reject).get(authMiddleware, this.bind(this.friendController.reject));
    return this.routers;
  }
}
