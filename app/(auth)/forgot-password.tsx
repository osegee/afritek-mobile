import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AuthHeader,
  AuthTextField,
  BackButton,
  PrimaryButton,
} from "@/components/auth-ui";
import { AuthColors, AuthLayout } from "@/constants/auth-theme";
import { AuthApi, toAuthError } from "@/lib/api/auth";

/**
 * Forgot password — sends a password reset email via the backend's
 * /forgot-password endpoint.
 */
export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await AuthApi.forgotPassword(email);
      Alert.alert(
        "Check your email",
        "We've sent password reset instructions to your email address.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert("Request failed", toAuthError(err).message);
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
            title="Forgot password?"
            subtitle="Enter your email and we'll send you instructions to reset your password"
          />

          <View style={styles.form}>
            <AuthTextField
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>

          <PrimaryButton
            label={loading ? "Sending..." : "Send reset link"}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.cta}
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  back: {
    marginBottom: 20,
  },
  form: {
    marginTop: 32,
  },
  cta: {
    marginTop: 28,
  },
});
