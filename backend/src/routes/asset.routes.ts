import { Router } from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  getUploadUrl,
  deleteAsset,
} from "../controllers/asset.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAssets);
router.get("/:id", getAssetById);

// Protect Routes
router.get("/upload/presigned-url", protect, getUploadUrl);
router.post("/", protect, createAsset);
router.delete("/:id", protect, deleteAsset);

export default router;
