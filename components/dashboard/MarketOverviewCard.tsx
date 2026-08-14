// components/dashboard/MarketOverviewCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../../constants/colors";
import { formatNaira } from "../../lib/format";
import type { ShareMarketOverview } from "../../types/dashboard";

interface Props {
  data: ShareMarketOverview;
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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Share Market Overview</Text>

      <Row label="Price per Share" value={formatNaira(data.pricePerShare)} />
      <Row
        label="Remaining Shares"
        value={data.remainingShares.toLocaleString("en-NG")}
      />
      <Row
        label="Sold Shares"
        value={data.soldShares.toLocaleString("en-NG")}
      />
      <View style={styles.divider} />
      <Row
        label="Total Market Value"
        value={formatNaira(data.totalMarketValue)}
      />
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
