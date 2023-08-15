import { hash, verify } from "argon2";
import { BadRequestError, UnauthenticatedError } from "../error/error";
import { PrismaClient, User } from "@prisma/client";
import { JwtService } from "../jwt/jwt.service";
import { Response } from "express";
import { exclude } from "../helpers/exclude";
import { ITokens } from "./interfaces/tokens";
import { Cookie } from "../helpers/cookie";
import { ILoginDto } from "./dto/login.dto";
import { IRegisterDto } from "./dto/register.dto";

export class AuthService {
  prisma;
  jwtService: JwtService;
  cookie: Cookie;

  constructor() {
    this.prisma = new PrismaClient();
    this.jwtService = new JwtService();
    this.cookie = new Cookie();
  }

  async login({ email, password }: ILoginDto): Promise<User> {
    const user: User | null = await this.prisma.user.findFirst({ where: { email } });
    if (!user) throw new BadRequestError("Wrong password or login");

    const checkPassword = await verify(user.password, password);
    if (!checkPassword) throw new BadRequestError("Wrong password or login");

    return user;
  }

  async register(user: IRegisterDto): Promise<User> {
    const existEmail: User | null = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (existEmail) throw new BadRequestError("This email already exists");
    const passwordHash = await hash(user.password);

    return await this.prisma.user.create({ data: { ...user, password: passwordHash } });
  }

  async logout(res: Response, id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token: null },
    });
    this.cookie.delete(res, "refresh_token", {
      path: "/",
      httpOnly: true,
    });
    this.cookie.delete(res, "id", {
      path: "/",
      httpOnly: true,
    });
  }

  async refreshToken(res: Response, id: string, rt: string): Promise<ITokens> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user || !user.refresh_token) throw new UnauthenticatedError("Your refresh token has expired");

    const checkRefresh = await verify(user.refresh_token, rt);
    if (!checkRefresh) throw new UnauthenticatedError("Your refresh token has expired");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshHash(user.id, tokens.refresh_token);
    this.cookie.set(res, "refresh_token", tokens.refresh_token, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });

    return tokens;
  }

  async buildUserResponseWithTokens(user: User, res: Response): Promise<{ access_token: string; user: User }> {
    const { access_token, refresh_token } = await this.getTokens(user.id, user.email);

    await this.updateRefreshHash(user.id, refresh_token);

    const userWithoutPassword = exclude<User>(user, "password", "refresh_token");

    this.cookie.set(res, "refresh_token", refresh_token, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });
    this.cookie.set(res, "id", user.id, { maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true });

    return { user: userWithoutPassword, access_token };
  }

  private async getTokens(id: string, email: string): Promise<ITokens> {
    return {
      access_token: this.jwtService.accessToken({ id, email }),
      refresh_token: this.jwtService.refreshToken({ id, email }),
    };
  }

  private async updateRefreshHash(id: string, rt: string): Promise<void> {
    const hashToken = await hash(rt);
    await this.prisma.user.update({
      where: { id },
      data: {
        refresh_token: hashToken,
      },
    });
  }
}
