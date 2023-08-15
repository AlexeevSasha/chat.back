import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.body?.token || req.query?.token || req.headers?.["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: 401, message: "Not Authorized token expired, please login again" });
  }

  try {
    const decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET)) as jwt.JwtPayload;

    req.user = {
      email: decoded.email,
      id: decoded.id,
    };

    next();
  } catch (error) {
    res.status(401).json({ status: 401, message: "Invalid token" });
  }
};
