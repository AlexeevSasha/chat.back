import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const refreshMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies && "refresh_token" in req.cookies && req.cookies.refresh_token.length > 0;

  if (!refreshToken) {
    return res.status(401).json({ status: 401, message: "Refresh token malformed" });
  }

  try {
    const token = req.cookies.refresh_token;
    const decoded = jwt.verify(token, String(process.env.REFRESH_TOKEN_SECRET)) as jwt.JwtPayload;

    req.user = {
      email: decoded.email,
      id: decoded.id,
      refresh_token: token,
    };

    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: "Invalid token" });
  }
};
