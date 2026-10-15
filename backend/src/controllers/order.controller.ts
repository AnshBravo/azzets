import type { Response } from "express";
import { prisma } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { stripe } from "../services/stripeService.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const createCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const buyerId = req.user?.userId;
  const { assetId } = req.body;

  if (!buyerId) {
    throw ApiError.unauthorized(
      "User authentication required to checkout items.",
    );
  }

  if (!assetId) {
    throw ApiError.badRequest(
      "Asset ID is strictly required to initialize checkout.",
    );
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    throw ApiError.notFound(
      "The 3D model you are trying to purchase does not exist.",
    );
  }

  if (asset.creatorId === buyerId) {
    throw ApiError.badRequest(
      "You cannot purchase an asset listing that you own.",
    );
  }

  const existingOrder = await prisma.order.findFirst({
    where: {
      buyerId: buyerId,
      assetId: assetId,
      status: "COMPLETED",
    },
  });

  if (existingOrder) {
    throw ApiError.badRequest(
      "You have already purchased this asset. Visit your vault profile to download it.",
    );
  }

  const unitAmountInCents = Math.round(Number(asset.price) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allowed_payment_method_types: ["card", "upi", "amazon_pay", "pay_by_bank"],

    customer_email: req.user?.email as string,

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: asset.title,
            description: asset.description || "3d asset listing File Asset",
          },
          unit_amount: unitAmountInCents,
        },
        quantity: 1,
      },
    ],

    metadata: {
      buyerId: buyerId,
      assetId: asset.id,
    },

    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  });

  res.status(200).json({
    success: true,
    status: "successful",
    checkoutUrl: session.url,
  });
};
