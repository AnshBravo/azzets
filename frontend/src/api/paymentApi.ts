import { apiClient } from "./client";

export const paymentApi = {
  createCheckoutSession: async (assetId: string) => {
    const response = await apiClient.post("/orders/checkout", { assetId });
    return response.data;
  },
};
