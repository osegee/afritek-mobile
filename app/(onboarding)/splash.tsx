import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { OnboardingColors } from "@/constants/onboarding-theme";

/**
 * Splash / flash screen — Figma node 1:436.
 *
 * Centred AFRITEK logomark with a tagline, plus a shimmer loading bar and a
 * "BLOCKCHAIN SECURED NODE" footer. Auto-advances to onboarding step 1 after a
 * short delay, mimicking the app-boot loading state in the design.
 *
 * The logomark isn't exported as an asset yet, so it's rendered as a styled
 * text stand-in — swap in <Image source={require(".../logo.png")} /> when the
 * asset lands.
 */
export default function Splash() {
  const router = useRouter();
  const shimmer = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();

    const timer = setTimeout(() => {
      router.replace("/(onboarding)");
    }, 2600);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [router, shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.logo}>
          <Text style={styles.logoAfri}>AFRI</Text>
          <Text style={styles.logoTek}>TEK</Text>
        </Text>
        <Text style={styles.logoSub}>T E C H N O L O G I E S</Text>
        <Text style={styles.tagline}>INNOVATE • CONNECT • EMPOWER</Text>
      </View>

      <SafeAreaView style={styles.footer} edges={["bottom"]}>
        <Text style={styles.poweredBy}>Powering the Future of African Tech</Text>

        <View
          style={styles.loaderTrack}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[styles.loaderShimmer, { transform: [{ translateX }] }]}
          />
        </View>

        <View style={styles.securedRow}>
          <Ionicons name="shield-checkmark" size={12} color="#5A5A5A" />
          <Text style={styles.securedText}>BLOCKCHAIN SECURED NODE</Text>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 2,
  },
  logoAfri: {
    color: "#E9A23B",
  },
  logoTek: {
    color: "#FFFFFF",
  },
  logoSub: {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: 6,
    marginTop: 8,
  },
  tagline: {
    color: "#8A8A8A",
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 24,
    alignItems: "center",
  },
  poweredBy: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 20,
  },
  loaderTrack: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  loaderShimmer: {
    width: "40%",
    height: "100%",
    backgroundColor: OnboardingColors.accent,
    borderRadius: 1,
  },
  securedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securedText: {
    color: "#5A5A5A",
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
