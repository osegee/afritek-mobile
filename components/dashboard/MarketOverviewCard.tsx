// components/dashboard/MarketOverviewCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../constants/colors";
import { formatNaira } from "../../lib/format";
import type { ShareMarketOverview } from "../../types/dashboard";

interface Props {
  data?: ShareMarketOverview & { totalValue?: number };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function MarketOverviewCard({ data }: Props) {
  if (!data) return null;

  const price = Number(data.pricePerShare ?? 0);
  const remaining = Number(data.remainingShares ?? 0);
  const sold = Number(data.soldShares ?? 0);
  const totalValue = Number(data.totalMarketValue ?? data.totalValue ?? 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Share Market Overview</Text>

      <Row label="Price per Share" value={formatNaira(price)} />
      <Row label="Remaining Shares" value={remaining.toLocaleString("en-NG")} />
      <Row label="Sold Shares" value={sold.toLocaleString("en-NG")} />
      <View style={styles.divider} />
      <Row label="Total Market Value" value={formatNaira(totalValue)} />
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
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
