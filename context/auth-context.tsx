import React, {
  createContext,
  useCallback,
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
    phone?: string,
    referralCode?: string,
  ) => Promise<void>;
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (patch: {
    fullName?: string;
    phone?: string;
  }) => Promise<void>;
  changePassword: any;
  forgotPassword: any;
  sendEmailVerification: any;
  resetPassword: any;
  verifyEmail: any;
  deleteAccount: any;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const token = await TokenStorage.getIdToken();
      if (token) {
        const currentUser = await AuthApi.getMe();
        setUser(currentUser);
      }
    } catch (err) {
      await TokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    referralCode?: string,
  ) {
    try {
      await AuthApi.signup({ email, password, fullName, referralCode });
      const loginResult = await AuthApi.login(email, password);
      await TokenStorage.setTokens(
        loginResult.tokens.idToken,
        loginResult.tokens.refreshToken,
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
        result.tokens.refreshToken,
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

  const changePassword = async ({ currentPassword, newPassword }) => {
    const response = await AuthApi.changePassword({
      currentPassword,
      newPassword,
    });
    return response;
  };

  const forgotPassword = useCallback(async (email) => {
    return AuthApi.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async ({ oobCode, newPassword }) => {
    return AuthApi.resetPassword({ oobCode, newPassword });
  }, []);

  const verifyEmail = useCallback(
    async (oobCode) => {
      const response = await AuthApi.verifyEmail(oobCode);

      try {
        await bootstrap();
      } catch {
        // ignore
      }
      return response;
    },
    [bootstrap],
  );

  const sendEmailVerification = useCallback(async () => {
    return AuthApi.sendEmailVerification();
  }, []);

  const deleteAccount = async () => {
    const response = await AuthApi.deleteAccount();
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
        bootstrap,
        changePassword,
        forgotPassword,
        sendEmailVerification,
        resetPassword,
        verifyEmail,
        deleteAccount,
      }}
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
