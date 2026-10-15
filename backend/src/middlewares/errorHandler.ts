import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any[] | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.status;
    message = err.message;
    errors = err.errors.length > 0 ? err.errors : undefined;
  } else if ("status" in err && typeof (err as any).status === "number") {
    statusCode = (err as any).status;
    message = err.message;
  }

  console.error(`[Error] ${statusCode} - ${message}\n`, err.stack);

  res.status(statusCode).json({
    succes: false,
    status: statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
