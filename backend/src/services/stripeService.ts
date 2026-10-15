import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  console.error(
    "❌ CRITICAL CONFIGURATION FAULT: STRIPE_SECRET_KEY variable is missing!",
  );
  process.exit(1);
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-11-13" as any,
  appInfo: {
    name: "azzets-3d-marketplace-backend",
    version: "1.0.0",
  },
});
