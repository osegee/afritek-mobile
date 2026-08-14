import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/auth-ui";
import { AuthColors, AuthFonts, AuthLayout } from "@/constants/auth-theme";
import { useAuth } from "@/context/auth-context";

/**
 * Setup success / welcome — Figma node 1:945.
 *
 * The design centres the AfriTek "AT" logomark over a scatter of decorative
 * sparkles. The logomark isn't exported as an asset yet, so it's rendered as a
 * text stand-in — drop in <Image source={require(".../logo.png")} /> when the
 * asset lands.
 */
export default function Success() {
  const router = useRouter();
  const { user } = useAuth();
  const username = user?.fullName ?? "there";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {/* Decorative sparkles, positioned loosely per the design. */}
      <Text style={[styles.sparkle, { top: 90, left: 40, fontSize: 10 }]}>
        ●
      </Text>
      <Text style={[styles.sparkle, { top: 70, right: 40, fontSize: 22 }]}>
        ▸
      </Text>
      <Text
        style={[
          styles.sparkle,
          { top: 150, left: 130, fontSize: 18, color: "#5B3FD9" },
        ]}
      >
        ✦
      </Text>
      <Text
        style={[
          styles.sparkle,
          { top: 190, right: 70, fontSize: 8, color: "#E97216" },
        ]}
      >
        ●
      </Text>

      <View style={styles.center}>
        <Text style={styles.logo}>AT</Text>

        <Text style={styles.greeting}>
          Hello {username}! <Text style={styles.wave}>👋</Text>
        </Text>
        <Text style={styles.greeting}>Welcome to Afritek</Text>

        <Text style={styles.subtitle}>It&apos;s great to have you here</Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          label="I'm ready to start!"
          onPress={() => router.replace("/(dashboard)" as any)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  sparkle: {
    position: "absolute",
    color: "#5B3FD9",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: AuthFonts.heading,
    fontSize: 56,
    fontWeight: "800",
    color: "#E9A23B",
    marginBottom: 20,
    letterSpacing: 2,
  },
  greeting: {
    fontFamily: AuthFonts.heading,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  wave: {
    fontSize: 24,
  },
  subtitle: {
    fontFamily: AuthFonts.body,
    fontSize: 15,
    color: AuthColors.body,
    marginTop: 16,
  },
  bottom: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingBottom: 24,
  },
});
