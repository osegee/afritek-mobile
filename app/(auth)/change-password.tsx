import { useRouter, useLocalSearchParams } from "expo-router";
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
import { useAuth } from "@/context/auth-context";

export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  // Retrieve token/code from URL params or deep link
  const params = useLocalSearchParams();
  const oobFromUrl =
    (params.oobCode as string) ||
    (params.oob as string) ||
    (params.code as string) ||
    "";

  const [oobCode, setOobCode] = useState(oobFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!oobCode.trim()) {
      Alert.alert(
        "Missing code",
        "Please enter the reset code sent to your email.",
      );
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Missing fields", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "New password and confirmation do not match.",
      );
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        oobCode: oobCode.trim(),
        newPassword,
      });

      Alert.alert("Success", "Password reset successfully. Please sign in.", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/sign-in"),
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Reset failed",
        (err as Error).message || "The code may be invalid or expired.",
      );
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
            title="Set new password"
            subtitle="Enter the code from your email and choose a new password"
          />

          <View style={styles.form}>
            <AuthTextField
              value={oobCode}
              onChangeText={setOobCode}
              placeholder="Reset code"
              autoCapitalize="none"
            />

            <AuthTextField
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              secureTextEntry
            />

            <AuthTextField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
          </View>

          <PrimaryButton
            label={loading ? "Resetting..." : "Reset password"}
            onPress={handleResetPassword}
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
});
