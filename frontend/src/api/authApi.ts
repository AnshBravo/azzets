import { apiClient } from "./client";

export interface RegisterPayload {
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
