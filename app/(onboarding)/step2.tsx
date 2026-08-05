import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
 * Onboarding step 2 — Figma node 1:488 ("flash screen").
 *
 * Same construction as step 1: exported hero artwork behind a black panel,
 * native type on top. The floating cards differ (payment card + contact card)
 * and the heading uses a tighter 35pt line height.
 */
export default function OnboardingStepTwo() {
  const router = useRouter();
  const scale = useDesignScale();

  return (
    <View style={styles.screen}>
      {/* Hero artwork — design-space 61,97 within the 390x844 frame. */}
      <Image
        source={require("@/assets/images/onboarding/step2-hero.png")}
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

      {/* Payment card, floating over the hero's left edge. */}
      <Image
        source={require("@/assets/images/onboarding/step2-payment.png")}
        style={[
          styles.floating,
          {
            left: 34 * scale,
            top: 260 * scale,
            width: 158 * scale,
            height: 68 * scale,
          },
        ]}
        contentFit="contain"
      />

      {/* Contact card, overlapping the hero's bottom-right. */}
      <Image
        source={require("@/assets/images/onboarding/step2-contact.png")}
        style={[
          styles.floating,
          {
            left: 238 * scale,
            top: 312 * scale,
            width: 94 * scale,
            height: 111.35 * scale,
          },
        ]}
        contentFit="contain"
      />

      {/* Rectangle 4220 — starts 12pt lower than on step 1. */}
      <View style={[styles.fadePanel, { top: 420 * scale }]} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <Text style={[styles.heading, { lineHeight: 35 * scale }]}>
            <Text>Become an </Text>
            <GradientWord style={styles.headingGradient}>Equity</GradientWord>
            <Text>{"\n"}Shareholder</Text>
          </Text>

          <Text style={[styles.body, { lineHeight: 26 * scale }]}>
            Own a piece of the next generation blockchain infrastructure. Direct
            dividends, voting rights, and hardware yields now accessible to the
            elite collective.
          </Text>
        </View>

        <View style={[styles.navBar, { paddingHorizontal: 36 * scale }]}>
          <Pagination total={ONBOARDING_STEPS} activeIndex={1} scale={scale} />
          {/*
           * Final step. The destination is intentionally not wired up yet —
           * it will point at the auth flow once that section exists.
           */}
          <NextButton
            scale={scale}
            accessibilityLabel="Finish onboarding"
            onPress={() => router.back()}
          />
        </View>

        {/* Demonstrates the <Link> route back to step 1, per the nav brief. */}
        <Link href="/(onboarding)" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to step 1"
            style={styles.backLinkHitArea}
          >
            <Text style={styles.backLink}>Back</Text>
          </Pressable>
        </Link>
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
    color: OnboardingColors.white,
    letterSpacing: -0.7,
  },
  headingGradient: {
    ...OnboardingType.heading,
    letterSpacing: -0.7,
  },
  body: {
    ...OnboardingType.body,
    marginTop: 23,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backLinkHitArea: {
    alignSelf: "center",
    paddingVertical: 16,
  },
  backLink: {
    ...OnboardingType.body,
    fontSize: 15,
  },
});
