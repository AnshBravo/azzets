import { apiClient } from "./client.ts";

export interface AssetQueryFilter {
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateAssetPayload {
  title: string;
  description?: string;
  category: string;
  licenseType: string;
  price: number;
  files: Array<{
    fileType: string;
    fileSize: number;
    s3Key: string;
  }>;
}

export const assetApi = {
  getAssets: async (filters: AssetQueryFilter = {}) => {
    const response = await apiClient.get("/assets", { params: filters });
    return response.data;
  },

  getAssetById: async (id: string) => {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  },

  getUploadUrl: async (params: {
    fileName: string;
    fileType: string;
    folder: "previews" | "vault";
  }) => {
    const response = await apiClient.get("/assets/upload/presigned-url", {
      params,
    });
    return response.data;
  },

  createAsset: async (payload: CreateAssetPayload) => {
    const response = await apiClient.post("/assets", payload);
    return response.data;
  },

  deleteAsset: async (id: string) => {
    const response = await apiClient.delete(`/assets/${id}`);
    return response.data;
  },
};
