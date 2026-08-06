import axios, { type AxiosError } from "axios";
import { TokenStorage } from "@/lib/storage/tokens";

const BASE_URL = "https://afritek-mdr1.vercel.app/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach idToken to every request (if present).
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await TokenStorage.getIdToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * On 401, attempt token refresh once.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;

      try {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) {
          await TokenStorage.clearTokens();
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { idToken: newIdToken, refreshToken: newRefreshToken } =
          data.data.tokens;
        await TokenStorage.setTokens(newIdToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newIdToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        await TokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
