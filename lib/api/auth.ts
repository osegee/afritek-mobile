import { apiClient } from "@/lib/api/client";
import { AxiosError } from "axios";

export interface AuthUser {
  uid: string;
  fullName?: string;
  email: string;
  phone?: string;
  referralCode?: string;
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
  referralCode?: string;
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
      { role: "user", ...payload },
    );
    return data.data.user;
  },

  async login(email: string, password: string): Promise<LoginResult> {
    const { data } = await apiClient.post<ApiEnvelope<LoginResult>>(
      "/auth/login",
      { email, password },
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getMe(): Promise<AuthUser> {
    const { data } =
      await apiClient.get<ApiEnvelope<{ user: AuthUser }>>("/auth/me");
    return data.data.user;
  },

  async updateProfile(patch: {
    fullName?: string;
    phone?: string;
    profileImage?: string;
  }): Promise<AuthUser> {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: AuthUser }>>(
      "/auth/profile",
      patch,
    );
    return data.data.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },
  async refreshToken(refreshToken: any) {
    return apiClient
      .post("/auth/refresh-token", { refreshToken })
      .then((res) => res.data);
  },

  async resetPassword({
    oobCode,
    newPassword,
  }: {
    oobCode: any;
    newPassword: string;
  }) {
    return apiClient
      .post("/auth/reset-password", { oobCode, newPassword })
      .then((res) => res.data);
  },

  async sendEmailVerification() {
    return apiClient
      .post("/auth/send-email-verification")
      .then((res) => res.data);
  },

  async verifyEmail(oobCode: any) {
    return apiClient
      .post("/auth/verify-email", { oobCode })
      .then((res) => res.data);
  },

  async changePassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) {
    return apiClient
      .patch("/auth/change-password", { currentPassword, newPassword })
      .then((res) => res.data);
  },

  async deleteAccount() {
    return apiClient.delete("/auth/account");
  },
};

// ====================== REFERRALS ======================
export const referralAPI = {
  async resolve(code: string) {
    return apiClient.get(`/referrals/resolve/${code}`);
  },
  async getMyStats() {
    return apiClient.get("/referrals/me");
  },
};

// ====================== SHARES ======================
export const shareAPI = {
  async getInfo() {
    return apiClient.get("/shares");
  },
  async getMyShares() {
    return apiClient.get("/shares/me");
  },
  async buy(body: any) {
    return apiClient.post("/shares/buy", body);
  },
  async verifyPaystack(reference: string) {
    return apiClient.post("/shares/verify/paystack", { reference });
  },
};

// ====================== WALLET ======================
export const walletAPI = {
  async get() {
    return apiClient.get("/wallet");
  },
  async deposit(body: any) {
    return apiClient.post("/wallet/deposit", body);
  },
};

// ====================== WITHDRAWALS ======================
export const withdrawalAPI = {
  async request(body: any) {
    return apiClient.post("/withdrawals", body);
  },
  async getMine() {
    return apiClient.get("/withdrawals/me");
  },
  async getPending() {
    return apiClient.get("/withdrawals/pending");
  },
  async process(id: any, body: any) {
    return apiClient.patch(`/withdrawals/${id}/process`, body);
  },
};
