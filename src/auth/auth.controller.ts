import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ILoginDto, LoginDto } from "./dto/login.dto";
import { IRegisterDto, RegisterDto } from "./dto/register.dto";

export class AuthController {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request<{}, {}, ILoginDto>, res: Response, next: NextFunction) {
    try {
      new LoginDto().validate(req.body);
      const user = await this.authService.login(req.body);
      const response = await this.authService.buildUserResponseWithTokens(user, res);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request<{}, {}, IRegisterDto>, res: Response, next: NextFunction) {
    try {
      new RegisterDto().validate(req.body);
      const user = await this.authService.register(req.body);
      const response = await this.authService.buildUserResponseWithTokens(user, res);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.logout(res, String(req?.user?.id));
      req.user = undefined;
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req?.user?.id ? req.user.id : "";
      const refresh = req?.user?.refresh_token ? req.user.refresh_token : "";

      const { access_token } = await this.authService.refreshToken(res, id, refresh);
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}
