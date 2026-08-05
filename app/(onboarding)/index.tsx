import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GradientWord,
  NextButton,
  Pagination,
  useDesignScale,
} from "@/components/onboarding-ui";
import {
  ONBOARDING_STEPS,
  OnboardingColors,
  OnboardingType,
} from "@/constants/onboarding-theme";

/**
 * Onboarding step 1 — Figma node 1:449 ("flash screen").
 *
 * The hero is a layered composition in Figma (orange ellipse + phone mockup +
 * two floating cards), exported as flat 3x PNGs rather than reconstructed in
 * code. The dark panel below it is Rectangle 4220: solid black with a large
 * upward shadow, which reads as the artwork fading out.
 */
export default function OnboardingStepOne() {
  const router = useRouter();
  const scale = useDesignScale();

  return (
    <View style={styles.screen}>
      {/* Hero artwork — design-space 61,97 → 314,423 within the 390x844 frame. */}
      <Image
        source={require("@/assets/images/onboarding/step1-hero.png")}
        style={[
          styles.hero,
          {
            left: 61 * scale,
            top: 97 * scale,
            width: 253 * scale,
            height: 326 * scale,
          },
        ]}
        contentFit="contain"
        transition={200}
      />

      {/* Shield badge, floating over the hero's left edge. */}
      <Image
        source={require("@/assets/images/onboarding/step1-badge.png")}
        style={[
          styles.floating,
          {
            left: 65 * scale,
            top: 217 * scale,
            width: 52.95 * scale,
            height: 52.95 * scale,
          },
        ]}
        contentFit="contain"
      />

      {/* "This month" chart card, overlapping the hero's bottom-right. */}
      <Image
        source={require("@/assets/images/onboarding/step1-chart.png")}
        style={[
          styles.floating,
          {
            left: 183.58 * scale,
            top: 325.57 * scale,
            width: 160 * scale,
            height: 97.67 * scale,
          },
        ]}
        contentFit="contain"
      />

      {/* Rectangle 4220 — black panel whose shadow fades the artwork above it. */}
      <View style={[styles.fadePanel, { top: 408 * scale }]} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <Text style={[styles.heading, { lineHeight: 40 * scale }]}>
            <Text>Own the </Text>
            <GradientWord style={styles.headingGradient}>Future</GradientWord>
            <Text> of{"\n"}African Technology</Text>
          </Text>

          <Text style={[styles.body, { lineHeight: 28 * scale }]}>
            Become an early investor in Africa&apos;s first blockchain smartphone
            company. Secure your stake in the decentralized hardware revolution.
          </Text>
        </View>

        <View style={[styles.navBar, { paddingHorizontal: 34 * scale }]}>
          <Pagination total={ONBOARDING_STEPS} activeIndex={0} scale={scale} />
          <NextButton
            scale={scale}
            accessibilityLabel="Continue to step 2"
            onPress={() => router.push("/(onboarding)/step2")}
          />
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
  floating: {
    position: "absolute",
    zIndex: 1,
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
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  heading: {
    ...OnboardingType.heading,
    color: OnboardingColors.heading,
    letterSpacing: -0.64,
  },
  headingGradient: {
    ...OnboardingType.heading,
    letterSpacing: -0.64,
  },
  body: {
    ...OnboardingType.body,
    marginTop: 22,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
});
