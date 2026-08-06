import * as SecureStore from "expo-secure-store";

const ID_TOKEN_KEY = "afritek_id_token";
const REFRESH_TOKEN_KEY = "afritek_refresh_token";

export const TokenStorage = {
  async getIdToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ID_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setTokens(idToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ID_TOKEN_KEY, idToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
