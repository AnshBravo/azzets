import express, { type Request, type Response } from "express";
import cors from "cors";
import { METHODS } from "node:http";
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  METHODS: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 6500;

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", message: `Server is running on PORT: ${PORT}` });
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT} ⚡`);
});
