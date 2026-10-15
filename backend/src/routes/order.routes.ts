import { Router } from "express";
import { createCheckoutSession } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkout", protect, createCheckoutSession);

export default router;
