import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GradientBorder } from "@/components/gradient-border";
import { AuthFonts } from "@/constants/auth-theme";

/**
 * Custom numeric keypad used by the Phone (1:830) and Verify Phone (1:815)
 * screens. Rendered in-app rather than relying on the OS keyboard so it can
 * match the design's dark rounded panel.
 */
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "del"];

export function NumericKeypad({
  onKeyPress,
  onDelete,
}: {
  onKeyPress: (digit: string) => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.pad}>
      {KEYS.map((key) => {
        if (key === "del") {
          return (
            <Pressable
              key={key}
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete"
              style={({ pressed }) => [styles.key, pressed && styles.pressed]}
            >
              <Ionicons name="backspace-outline" size={26} color="#FFFFFF" />
            </Pressable>
          );
        }
        return (
          <Pressable
            key={key}
            onPress={() => onKeyPress(key)}
            accessibilityRole="button"
            accessibilityLabel={key}
            style={({ pressed }) => [styles.key, pressed && styles.pressed]}
          >
            <Text style={styles.keyText}>{key}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * One-time-code entry as a row of individual boxes. The box that will receive
 * the next digit gets an underscore caret, matching the design.
 */
export function OtpBoxes({
  value,
  length = 5,
}: {
  value: string;
  length?: number;
}) {
  return (
    <View style={styles.otpRow}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i];
        const isNext = i === value.length;
        const filled = char !== undefined;
        const activeBorder = filled || isNext;
        return (
          <GradientBorder
            key={i}
            radius={14}
            active={activeBorder}
            style={styles.otpSlot}
          >
            <View style={[styles.otpBox, !activeBorder && styles.otpBoxIdle]}>
              {filled ? (
                <Text style={styles.otpChar}>{char}</Text>
              ) : isNext ? (
                <View style={styles.otpCaret} />
              ) : null}
            </View>
          </GradientBorder>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#141414",
    borderRadius: 24,
    paddingVertical: 8,
  },
  key: {
    width: "33.333%",
    height: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  keyText: {
    fontFamily: AuthFonts.ui,
    fontSize: 28,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  otpRow: {
    flexDirection: "row",
    gap: 12,
  },
  otpSlot: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 60,
  },
  otpBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxIdle: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 14,
  },
  otpChar: {
    fontFamily: AuthFonts.heading,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  otpCaret: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
});
