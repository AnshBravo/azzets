import jwt, { type SignOptions } from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

export interface UserTokenPayload {
  userId: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "❌ CRITICAL ERROR: JWT_SECRET environment variable is missing!",
  );
  process.exit(1);
}

export class JwtUtil {
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

  static signToken(payload: UserTokenPayload): string {
    const signOptions = {
      expiresIn: this.EXPIRES_IN || "7d",
    } as jwt.SignOptions;
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, signOptions);
  }

  static verifyToken(token: string): UserTokenPayload {
    try {
      const decoded = jwt.verify(
        token,
        JWT_SECRET as jwt.Secret,
      ) as UserTokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized(`Session has expired. Please login again.`);
      }

      throw ApiError.unauthorized("Invalid or tampered authentication token.");
    }
  }
}
