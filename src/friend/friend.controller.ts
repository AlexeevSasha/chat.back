import { NextFunction, Request, Response } from "express";
import { FriendService } from "./friend.service";
import { FriendDto } from "./dto/friend.dto";

export class FriendController {
  private friendService: FriendService;

  constructor() {
    this.friendService = new FriendService();
  }

  async invite(req: Request<{}, {}, { email: string }>, res: Response, next: NextFunction) {
    try {
      new FriendDto().email(req.body.email);
      await this.friendService.invite(req.body.email, req.user?.id as string);
      res.status(200).json({ message: "The invitation was successfully sent" });
    } catch (error) {
      next(error);
    }
  }

  async accept(req: Request<{}, {}, {}, { id: string }>, res: Response, next: NextFunction) {
    try {
      new FriendDto().checkId(req.query.id);
      await this.friendService.accept(req.query.id);
      res.status(200).json({ message: "Invitation accepted" });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request<{}, {}, {}, { id: string }>, res: Response, next: NextFunction) {
    try {
      new FriendDto().checkId(req.query.id);
      await this.friendService.reject(req.query.id, req.user?.id as string);
      res.status(200).json({ message: "Invitation succesfully rejected" });
    } catch (error) {
      next(error);
    }
  }

  async getAllInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const allInvite = await this.friendService.getAllInvite(req.user?.id as string);
      res.status(200).json(allInvite);
    } catch (error) {
      next(error);
    }
  }
}
