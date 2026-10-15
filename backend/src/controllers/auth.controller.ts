import type { Request, Response } from "express";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { JwtUtil } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const register = async (req: Request, res: Response) => {
  const { username, email, avatarUrl, bio, password } = req.body;

  if (!email || !password || !username) {
    throw ApiError.badRequest(
      "Username, email, and password fields are all required.",
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    throw ApiError.badRequest("Please provide a valid email structure.");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw ApiError.badRequest("Email is already taken.");
    }
    if (existingUser.username === username) {
      throw ApiError.badRequest("Username is already taken.");
    }
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      hashedPassword: hash,
      avatarUrl: avatarUrl,
      bio: bio,
    },
  });

  const { hashedPassword: _, ...sanitizedUser } = newUser;

  const token = JwtUtil.signToken({ userId: newUser.id, email: newUser.email });

  res.status(200).json({
    success: true,
    status: "successful",
    user: sanitizedUser,
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw ApiError.badRequest("Password and Email are required.");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw ApiError.badRequest("A valid email is required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw ApiError.notFound("Invalid email or password.");
  }

  const compared = await bcrypt.compare(password, user.hashedPassword);

  if (!compared) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const token = JwtUtil.signToken({ userId: user.id, email: user.email });

  const { hashedPassword: _, ...sanitizedUser } = user;

  res.status(200).json({
    success: true,
    status: "successful",
    user: sanitizedUser,
    token,
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw ApiError.unauthorized("User is not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
  });

  if (!user) {
    throw ApiError.notFound("User profile couldn't be located.");
  }

  const { hashedPassword: _, ...sanitizedUser } = user;

  res.status(200).json({
    success: true,
    status: "successful",
    user: sanitizedUser,
  });
};
