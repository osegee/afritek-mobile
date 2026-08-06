import { AxiosError } from "axios";
import { apiClient } from "@/lib/api/client";

/** Shape of a user document returned by the backend. */
export interface AuthUser {
  uid: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: "admin" | "moderator" | "user";
  profileImage?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface AuthTokens {
  idToken: string;
  refreshToken: string;
  expiresIn?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
}

/**
 * Normalizes any axios/network failure into a plain Error with a user-facing
 * message pulled from the backend's { success:false, message } envelope.
 */
export function toAuthError(err: unknown): Error {
  if (err instanceof AxiosError) {
    const data = err.response?.data as
      | { message?: string; errors?: { message: string }[] }
      | undefined;
    if (data?.errors?.length) {
      return new Error(data.errors.map((e) => e.message).join("\n"));
    }
    if (data?.message) {
      return new Error(data.message);
    }
    if (err.code === "ECONNABORTED") {
      return new Error("Request timed out. Please try again.");
    }
    if (!err.response) {
      return new Error("Network error. Check your connection and try again.");
    }
  }
  return new Error("Something went wrong. Please try again.");
}

export const AuthApi = {
  async signup(payload: SignupPayload): Promise<AuthUser> {
    const { data } = await apiClient.post<ApiEnvelope<{ user: AuthUser }>>(
      "/auth/signup",
      { role: "user", ...payload }
    );
    return data.data.user;
  },

  async login(email: string, password: string): Promise<LoginResult> {
    const { data } = await apiClient.post<ApiEnvelope<LoginResult>>(
      "/auth/login",
      { email, password }
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiEnvelope<{ user: AuthUser }>>(
      "/auth/me"
    );
    return data.data.user;
  },

  async updateProfile(patch: {
    fullName?: string;
    phone?: string;
    profileImage?: string;
  }): Promise<AuthUser> {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: AuthUser }>>(
      "/auth/profile",
      patch
    );
    return data.data.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },
};
