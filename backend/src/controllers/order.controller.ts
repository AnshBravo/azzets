import type { Request, Response } from "express";
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

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    throw ApiError.badRequest(
      "Missing Stripe structural signature or backend webhook credentials",
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody || req.body,
      sig,
      webhookSecret,
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

  res.status(200).json({ received: true });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const buyerId = session.metadata?.buyerId;
    const assetId = session.metadata?.assetId;
    const stripePaymentIntentId = session.payment_intent as string;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    if (!buyerId || !assetId) {
      console.error(
        "💥 Critical Webhook Failure: Session metadata is completely missing data blocks.",
      );
      return;
    }

    try {
      await prisma.order.create({
        data: {
          buyerId,
          assetId,
          stripePaymentIntentId,
          amount: amountTotal,
          status: "COMPLETED",
        },
      });
      console.log(
        `🎉 Order compiled successfully for Buyer: ${buyerId} -> Asset: ${assetId}`,
      );
    } catch (dbError) {
      console.error(
        "💥 Database Error while capturing completed webhook order:",
        dbError,
      );
    }
  }
};
