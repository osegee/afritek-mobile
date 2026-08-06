import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NumericKeypad, OtpBoxes } from "@/components/auth-keypad";
import { AuthHeader, BackButton, PrimaryButton } from "@/components/auth-ui";
import { AuthColors, AuthLayout, AuthType } from "@/constants/auth-theme";

const CODE_LENGTH = 5;

/** Enter verification code — Figma node 1:815. */
export default function VerifyPhone() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <BackButton onPress={() => router.back()} style={styles.back} />

        <AuthHeader
          title="Enter verification code"
          subtitle="We have sent the code verification to your mobile number"
        />

        <View style={styles.otp}>
          <OtpBoxes value={code} length={CODE_LENGTH} />
        </View>

        <Pressable
          onPress={() => setCode("")}
          hitSlop={8}
          style={styles.resendWrap}
          accessibilityRole="button"
        >
          <Text style={styles.resend}>Resend code</Text>
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          label="Verify account"
          onPress={() => router.replace("/(auth)/success")}
          style={styles.cta}
        />
        <NumericKeypad
          onKeyPress={(d) =>
            setCode((prev) => (prev.length < CODE_LENGTH ? prev + d : prev))
          }
          onDelete={() => setCode((prev) => prev.slice(0, -1))}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
    justifyContent: "space-between",
  },
  top: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingTop: 12,
  },
  back: {
    marginBottom: 20,
  },
  otp: {
    marginTop: 28,
  },
  resendWrap: {
    marginTop: 14,
    alignSelf: "flex-start",
  },
  resend: {
    ...AuthType.footerLink,
    fontSize: 14,
  },
  bottom: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingBottom: 8,
  },
  cta: {
    marginBottom: 24,
  },
});
