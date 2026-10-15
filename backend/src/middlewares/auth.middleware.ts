import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { JwtUtil } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized(
      "Access denied. No authentication token provided",
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized(
      "Access denied. No authentication token provided",
    );
  }

  const decodedPayload = JwtUtil.verifyToken(token);

  req.user = {
    userId: decodedPayload.userId,
    email: decodedPayload.email,
  };

  next();
};
