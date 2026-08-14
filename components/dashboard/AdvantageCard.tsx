// components/dashboard/AdvantageCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../constants/colors";
import type { EquityAdvantage } from "../../types/dashboard";

interface Props {
  advantage: EquityAdvantage;
}

export default function AdvantageCard({ advantage }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={advantage.icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={colors.gold}
        />
      </View>
      <Text style={styles.title}>{advantage.title}</Text>
      <Text style={styles.description}>{advantage.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.goldMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
});
