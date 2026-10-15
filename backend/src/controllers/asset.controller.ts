import type { Request, Response } from "express";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUploadPresignedUrl } from "../services/s3Service.js";
import { generateDownloadPresignedUrl } from "../services/s3Service.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const getUploadUrl = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const creatorId = req.user?.userId;

  if (!creatorId) {
    throw ApiError.unauthorized("Usr in not authenticated");
  }

  const { fileName, fileType, folder } = req.query;

  if (!fileName || !fileType || !folder) {
    throw ApiError.badRequest(
      "Missing query parameters: fileName, fileType, or folder required.",
    );
  }

  if (folder !== "previews" && folder !== "vault") {
    throw ApiError.badRequest("Invalid folder destination selection.");
  }

  const s3Target = await generateUploadPresignedUrl({
    fileName: fileName as string,
    fileType: fileType as string,
    folder: folder as "previews" | "vault",
  });

  res.status(200).json({
    success: true,
    data: {
      uploadUrl: s3Target.uploadUrl,
      s3Key: s3Target.s3Key,
    },
  });
};

export const createAsset = async (req: AuthenticatedRequest, res: Response) => {
  const creatorId = req.user?.userId;

  if (!creatorId) {
    throw ApiError.unauthorized("User is not authenticated");
  }

  const { title, description, category, licenseType, price, files } = req.body;

  if (
    !title ||
    !category ||
    !licenseType ||
    price === undefined ||
    !files ||
    !files.length
  ) {
    throw new ApiError(400, "Missing required asset fields or files");
  }

  const newAsset = await prisma.asset.create({
    data: {
      title,
      description,
      category,
      licenseType,
      price,
      creatorId,
      files: {
        create: files.map(
          (file: { fileType: string; s3Key: string; fileSize: number }) => ({
            fileType: file.fileType,
            s3Key: file.s3Key,
            fileSize: file.fileSize,
          }),
        ),
      },
    },
    include: {
      files: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "Asset successfully listed",
    data: newAsset,
  });
};

export const getAssetById = async (req: Request, res: Response) => {
  const assetId = req.params.id as string;

  if (!assetId) {
    throw ApiError.badRequest("Asset ID parameter is required.");
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      creator: {
        select: { username: true, avatarUrl: true, bio: true },
      },
      files: true,
    },
  });

  if (!asset) {
    throw ApiError.notFound("The requested 3d asset could not be found.");
  }

  const filesWithUrls = await Promise.all(
    asset.files.map(async (file) => {
      let secureUrl = "";
      try {
        secureUrl = await generateDownloadPresignedUrl(file.s3Key);
      } catch (error) {
        console.error(`Failed to sign URL for file key: ${file.s3Key}`, error);
      }

      return {
        ...file,
        downloadUrl: secureUrl,
      };
    }),
  );

  res.status(200).json({
    success: true,
    data: {
      ...asset,
      files: filesWithUrls,
    },
  });
};

export const getAssets = async (req: Request, res: Response) => {
  const { category, page = "1", limit = "10" } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = category ? { category: category as string } : {};

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { username: true, avatarUrl: true, bio: true },
        },
        files: true,
      },
      skip,
      take: limitNum,
      orderBy: { id: "desc" },
    }),
    prisma.asset.count({ where: whereClause }),
  ]);

  res.status(200).json({
    success: true,
    data: assets,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const deleteAsset = async (req: AuthenticatedRequest, res: Response) => {
  const creatorId = req.user?.userId;
  const assetId = req.params.id as string;

  if (!creatorId) {
    throw ApiError.unauthorized("User is not authenticated.");
  }

  if (!assetId) {
    throw ApiError.badRequest("Asset ID parameter is required.");
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    throw ApiError.notFound(
      "The asset you are trying to delete could not be found.",
    );
  }

  if (asset.creatorId !== creatorId) {
    throw ApiError.forbidden(
      "You do not have permission to delete this asset.",
    );
  }

  const deletedRecord = await prisma.asset.delete({
    where: { id: assetId },
  });

  res.status(200).json({
    success: true,
    status: "successful",
    message: "Asset listing and related records successfully removed.",
  });
};
