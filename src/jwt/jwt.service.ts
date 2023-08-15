import jwt from "jsonwebtoken";
import { IJwtPayload } from "./interfaces/jwt.payload";

export class JwtService {
  public getToken({ id, email }: IJwtPayload, expires: string, secret: string) {
    return jwt.sign({ id, email }, secret, {
      expiresIn: expires || "1d",
    });
  }

  refreshToken({ id, email }: IJwtPayload) {
    return this.getToken({ id, email }, "30d", String(process.env.REFRESH_TOKEN_SECRET));
  }

  accessToken({ id, email }: IJwtPayload) {
    return this.getToken({ id, email }, "1d", String(process.env.ACCESS_TOKEN_SECRET));
  }
}
