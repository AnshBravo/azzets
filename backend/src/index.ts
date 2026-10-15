import express, { type Request, type Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

//Controller routes
import { handleStripeWebhook } from "./controllers/order.controller.js";
import authRoutes from "./routes/auth.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
const PORT = process.env.PORT || 6500;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", message: `Server is running on PORT: ${PORT}` });
});

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT} ⚡`);
});
