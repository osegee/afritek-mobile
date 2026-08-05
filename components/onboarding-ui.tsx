import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";

import {
  DESIGN_WIDTH,
  OnboardingColors,
  OnboardingControls,
  OnboardingGradient,
} from "@/constants/onboarding-theme";

/**
 * Shared onboarding chrome, extracted so both step screens stay in sync.
 * Each screen keeps its own layout + StyleSheet; only these primitives are
 * shared, because they are pixel-identical across frames 1:449 and 1:488.
 */

/**
 * Both onboarding frames were drawn on a 390pt-wide artboard. Every hard-coded
 * offset in the screen files is a design-space value, so multiply it by this
 * factor to land in the right place on any device width.
 */
export function useDesignScale() {
  const { width } = useWindowDimensions();
  return width / DESIGN_WIDTH;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mixHex(from: string, to: string, t: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const ch = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${ch(a.r, b.r)}, ${ch(a.g, b.g)}, ${ch(a.b, b.b)})`;
}

/**
 * Renders a single word carrying the heading's horizontal gradient.
 *
 * React Native cannot paint a gradient into glyphs without a masked-view +
 * linear-gradient dependency, so the gradient is approximated by stepping the
 * colour per character across the word. At 32pt the banding is not perceptible.
 * Swap this for MaskedView + expo-linear-gradient if you want a true ramp.
 */
export function GradientWord({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
}) {
  const chars = Array.from(children);
  const lastIndex = Math.max(chars.length - 1, 1);

  return (
    <>
      {chars.map((char, i) => (
        <Text
          key={`${char}-${i}`}
          style={[
            style,
            { color: mixHex(OnboardingGradient.from, OnboardingGradient.to, i / lastIndex) },
          ]}
        >
          {char}
        </Text>
      ))}
    </>
  );
}

/** Pagination pills — one per step, the current one widened to a bar. */
export function Pagination({
  total,
  activeIndex,
  scale,
}: {
  total: number;
  activeIndex: number;
  scale: number;
}) {
  return (
    <View
      style={[styles.pagination, { gap: OnboardingControls.dotGap * scale }]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${activeIndex + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <View
            key={i}
            style={{
              height: OnboardingControls.dotHeight * scale,
              width:
                (active
                  ? OnboardingControls.dotWidthActive
                  : OnboardingControls.dotWidthInactive) * scale,
              borderRadius: (OnboardingControls.dotHeight / 2) * scale,
              backgroundColor: active
                ? OnboardingColors.accent
                : OnboardingColors.paginationInactive,
            }}
          />
        );
      })}
    </View>
  );
}

/** Circular accent button with a forward chevron. */
export function NextButton({
  onPress,
  scale,
  accessibilityLabel,
}: {
  onPress: () => void;
  scale: number;
  accessibilityLabel: string;
}) {
  const size = OnboardingControls.nextButtonSize * scale;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      style={({ pressed }) => [
        styles.nextButton,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && styles.nextButtonPressed,
      ]}
    >
      <Ionicons
        name="chevron-forward"
        size={OnboardingControls.chevronSize * scale}
        color={OnboardingColors.onAccent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: OnboardingColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonPressed: {
    opacity: 0.8,
  },
});
