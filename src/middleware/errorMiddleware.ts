import { Response, Request, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export const ErrorHandlerMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 400;
  const msg = error.message || "Something went wrong, try again later";

  res.status(status).json({ status: status, message: msg });
  next();
};
