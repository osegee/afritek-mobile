import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GradientWord, useDesignScale } from "@/components/onboarding-ui";
import { OnboardingColors, OnboardingType } from "@/constants/onboarding-theme";

/**
 * Onboarding step 3 — "Become an AfriTek Shareholder".
 *
 * Matches the step-1/step-2 language: full-bleed hero chart, a fade panel that
 * blends the image into the black background, and the heading's highlighted
 * word carrying the brand gradient (#3E52C1 → #E97216) via <GradientWord>.
 * Being the final step, the nav-bar is replaced by a full-width CTA.
 */
export default function OnboardingStepThree() {
  const router = useRouter();
  const scale = useDesignScale();

  return (
    <View style={styles.screen}>
      {/* Hero background — single large cover image of the stock charts. */}
      <Image
        source={require("@/assets/images/onboarding/step3-chart.png")}
        style={[
          styles.hero,
          {
            left: 0,
            top: 0,
            width: "100%",
            height: 500 * scale,
          },
        ]}
        contentFit="cover"
        transition={200}
      />

      {/* Fade panel to smoothly blend the hero image into the solid background. */}
      <View style={[styles.fadePanel, { top: 420 * scale }]} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <Text style={[styles.heading, { lineHeight: 42 * scale }]}>
            <Text>Become an </Text>
            <GradientWord style={styles.headingGradient}>AfriTek</GradientWord>
            <Text>{"\n"}Shareholder</Text>
          </Text>

          <Text style={[styles.body, { lineHeight: 26 * scale }]}>
            Own equity in Africa&apos;s first blockchain smartphone company and
            be part of the future of innovation.
          </Text>
        </View>

        <View
          style={[styles.buttonContainer, { paddingHorizontal: 24 * scale }]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              { height: 56 * scale, borderRadius: 28 * scale },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text style={[styles.buttonText, { fontSize: 16 * scale }]}>
              Get started
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  hero: {
    position: "absolute",
  },
  fadePanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: OnboardingColors.background,
    shadowColor: OnboardingColors.background,
    shadowOffset: { width: 0, height: -35 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 24,
  },
  safeArea: {
    flex: 1,
    zIndex: 3,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heading: {
    ...OnboardingType.heading,
    textAlign: "left",
    color: OnboardingColors.white,
    letterSpacing: -0.7,
    fontSize: 34,
    fontWeight: "800",
  },
  headingGradient: {
    ...OnboardingType.heading,
    textAlign: "left",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  body: {
    ...OnboardingType.body,
    textAlign: "left",
    marginTop: 16,
    color: OnboardingColors.body,
    fontSize: 15,
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: 16,
  },
  button: {
    backgroundColor: OnboardingColors.accent,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: OnboardingColors.white,
    fontWeight: "700",
  },
});
