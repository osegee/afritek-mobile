// components/dashboard/TierProgressCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../constants/colors";
import { formatNaira } from "../../lib/format";
import { INVESTOR_TIERS } from "../../types/dashboard";
import type { InvestorTierProgress } from "../../types/dashboard";

interface Props {
  progress: InvestorTierProgress;
}

export default function TierProgressCard({ progress }: Props) {
  const currentIndex = INVESTOR_TIERS.indexOf(progress.currentTier);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Investor Tier Progress</Text>
        {progress.nextTier && (
          <Text style={styles.nextTier}>
            Next: {progress.nextTier}
            {progress.amountToNextTier != null
              ? `  ${formatNaira(progress.amountToNextTier)}`
              : ""}
          </Text>
        )}
      </View>

      <Text style={styles.subtitle}>
        You&apos;re at Investor level{" "}
        <Text style={styles.currentTier}>{progress.currentTier}</Text>
      </Text>

      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${progress.progressPercent}%` }]}
        />
      </View>

      <View style={styles.labelsRow}>
        {INVESTOR_TIERS.map((tier, index) => (
          <Text
            key={tier}
            style={[
              styles.tierLabel,
              index <= currentIndex && styles.tierLabelActive,
            ]}
          >
            {tier}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  nextTier: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  currentTier: {
    color: colors.gold,
    fontWeight: "700",
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tierLabel: {
    color: colors.textMuted,
    fontSize: 10,
  },
  tierLabelActive: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
});
