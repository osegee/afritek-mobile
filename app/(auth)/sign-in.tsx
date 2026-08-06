import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AuthFooterLink,
  AuthHeader,
  AuthTextField,
  BackButton,
  OrDivider,
  PrimaryButton,
  SocialButton,
} from "@/components/auth-ui";
import { AuthColors, AuthLayout, AuthType } from "@/constants/auth-theme";
import { useAuth } from "@/context/auth-context";

/** Sign in — Figma nodes 1:734 (empty) / 1:775 (filled). */
export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(auth)/success");
    } catch (err) {
      Alert.alert("Sign in failed", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton onPress={() => router.back()} style={styles.back} />

          <AuthHeader
            title="Sign in"
            subtitle="Welcome back, Sign in to your account"
          />

          <View style={styles.form}>
            <AuthTextField
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <AuthTextField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />
          </View>

          <PrimaryButton
            label={loading ? "Signing in..." : "Sign in"}
            onPress={handleSignIn}
            disabled={loading}
            style={styles.cta}
          />

          <Pressable
            onPress={() => router.push("/(auth)/forgot-password")}
            hitSlop={8}
            style={styles.forgotWrap}
            accessibilityRole="link"
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          <View style={styles.dividerWrap}>
            <OrDivider />
          </View>

          <View style={styles.social}>
            <SocialButton provider="google" onPress={() => {}} />
            <SocialButton provider="apple" onPress={() => {}} />
          </View>

          <AuthFooterLink
            prompt="Don't have an account?"
            linkLabel="Sign up"
            onPress={() => router.replace("/(auth)/sign-up")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingTop: AuthLayout.backButtonTop,
    paddingBottom: 32,
  },
  back: {
    marginBottom: AuthLayout.headerGapAfterBack,
  },
  form: {
    marginTop: 32,
    gap: 20,
  },
  cta: {
    marginTop: 28,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 14,
  },
  forgot: {
    ...AuthType.footerLink,
    fontSize: 13,
  },
  dividerWrap: {
    marginTop: 24,
    marginBottom: 20,
  },
  social: {
    gap: AuthLayout.socialButtonSpacing,
    marginBottom: 24,
  },
});
