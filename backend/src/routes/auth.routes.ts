import { login, register, getMe } from "../controllers/auth.controller.js";

import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;
