import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
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
import { AuthColors, AuthLayout } from "@/constants/auth-theme";
import { useAuth } from "@/context/auth-context";
import { colors } from "@/constants/colors";

/** Sign up — Figma nodes 1:665 (empty) / 1:696 (filled). */
export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    const referralCode = refCode || "";

    setLoading(true);
    try {
      await signUp(email, password, fullName, referralCode);
      router.push("/(auth)/phone");
    } catch (err) {
      Alert.alert("Sign up failed", (err as Error).message);
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
            title="Create Account"
            subtitle="Your journey to owning equity in Africa's first blockchain smartphone company starts with just $1."
          />

          <View style={styles.form}>
            <AuthTextField
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              autoCapitalize="words"
            />
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
            <AuthTextField
              value={refCode}
              onChangeText={setRefCode}
              placeholder="Referral code (Optional)"
              autoCapitalize="characters"
            />
          </View>

          <View>
            <Text style={styles.text}>
              By continuing you agree to our <Text style={{textDecorationLine: "underline"}}>Terms & Conditions</Text>
            </Text>
          </View>

          <PrimaryButton
            label={loading ? "Creating account..." : "Continue"}
            onPress={handleSignUp}
            disabled={loading}
            style={styles.cta}
          />

          <View style={styles.dividerWrap}>
            <OrDivider />
          </View>

          <View style={styles.social}>
            <SocialButton provider="google" onPress={() => {}} />
            <SocialButton provider="apple" onPress={() => {}} />
          </View>

          <AuthFooterLink
            prompt="Already have an account?"
            linkLabel="Sign In"
            onPress={() => router.replace("/(auth)/sign-in")}
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
    marginTop: 28,
    gap: 20,
  },
  cta: {
    marginTop: 28,
  },
  dividerWrap: {
    marginTop: 24,
    marginBottom: 20,
  },
  text: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 20,
  },
  social: {
    gap: AuthLayout.socialButtonSpacing,
    marginBottom: 24,
  },
});
