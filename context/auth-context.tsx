import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthApi, toAuthError, type AuthUser } from "@/lib/api/auth";
import { TokenStorage } from "@/lib/storage/tokens";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (patch: {
    fullName?: string;
    phone?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const token = await TokenStorage.getIdToken();
      if (token) {
        const currentUser = await AuthApi.me();
        setUser(currentUser);
      }
    } catch (err) {
      await TokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) {
    try {
      await AuthApi.signup({ email, password, fullName, phone });
      const loginResult = await AuthApi.login(email, password);
      await TokenStorage.setTokens(
        loginResult.tokens.idToken,
        loginResult.tokens.refreshToken
      );
      setUser(loginResult.user);
    } catch (err) {
      throw toAuthError(err);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const result = await AuthApi.login(email, password);
      await TokenStorage.setTokens(
        result.tokens.idToken,
        result.tokens.refreshToken
      );
      setUser(result.user);
    } catch (err) {
      throw toAuthError(err);
    }
  }

  async function signOut() {
    try {
      await AuthApi.logout();
    } catch {
      // Best-effort; always clear local state.
    } finally {
      await TokenStorage.clearTokens();
      setUser(null);
    }
  }

  async function updateUserProfile(patch: {
    fullName?: string;
    phone?: string;
  }) {
    try {
      const updated = await AuthApi.updateProfile(patch);
      setUser(updated);
    } catch (err) {
      throw toAuthError(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signUp, signIn, signOut, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
