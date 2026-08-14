// app/(dashboard)/index.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { router } from 'expo-router';
import { colors, spacing, radius } from "../../constants/colors";
import { formatNaira } from "../../lib/format";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import MarketOverviewCard from "../../components/dashboard/MarketOverviewCard";
import TierProgressCard from "../../components/dashboard/TierProgressCard";
import AdvantageCard from "../../components/dashboard/AdvantageCard";
import SideMenu from "../../components/dashboard/sideMenu";
import type {
  DashboardStats,
  DashboardUser,
  EquityAdvantage,
  InvestorTierProgress,
  ShareMarketOverview,
} from "../../types/dashboard";

// TODO: replace with real data from your auth/wallet context or an API hook
const MOCK_USER: DashboardUser = {
  name: "Maximus Prime",
  email: "maximus@email.net",
};

const MOCK_STATS: DashboardStats = {
  sharesOwned: 0,
  totalInvested: 0,
  walletBalance: 37036,
  referralEarnings: 0,
};

const MOCK_MARKET: ShareMarketOverview = {
  pricePerShare: 20000,
  remainingShares: 999986,
  soldShares: 14,
  totalMarketValue: 20000000000,
};

const MOCK_TIER_PROGRESS: InvestorTierProgress = {
  currentTier: "Gold",
  nextTier: "Platinum",
  amountToNextTier: 500000,
  progressPercent: 55,
};

const MOCK_ADVANTAGES: EquityAdvantage[] = [
  {
    id: "fractional-equity",
    icon: "pie-chart-outline",
    title: "Fractional Equity",
    description: "Own premium shares instantly.",
  },
  {
    id: "early-access",
    icon: "flash-outline",
    title: "Early Access",
    description: "First look at new listings.",
  },
  {
    id: "priority-allocation",
    icon: "checkmark-circle-outline",
    title: "Priority Allocation",
    description: "Guaranteed buy-in blocks.",
  },
  {
    id: "on-chain-earnings",
    icon: "link-outline",
    title: "On-Chain Earnings",
    description: "Transparent yield tracking.",
  },
];

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const handleSelectMenuItem = (key: string) => {
    setMenuVisible(false);
    if (key === "dashboard") return;
    // TODO: wire these to your actual routes once those screens exist
    // router.push(`/(dashboard)/${key}`);
  };

  const handleSignOut = () => {
    setMenuVisible(false);
    // TODO: clear auth session via your auth context, then redirect
    // router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          user={MOCK_USER}
          onPressMenu={() => setMenuVisible(true)}
          onPressNotifications={() => {
            // TODO: navigate to notifications screen
          }}
        />

        <View style={styles.body}>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.greetingName}>{MOCK_USER.name}</Text>
          <Text style={styles.greetingSubtitle}>
            Track and manage your investments in one place.
          </Text>

          <Pressable
            style={styles.buyButton}
            onPress={() => {
              // TODO: navigate to the buy-shares flow
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.background}
            />
            <Text style={styles.buyButtonLabel}>Buy Shares</Text>
          </Pressable>

          <View style={styles.statsGrid}>
            <StatCard
              icon="pie-chart-outline"
              label="Shares Owned"
              value={MOCK_STATS.sharesOwned.toLocaleString("en-NG")}
              sublabel="Active Shares"
            />
            <StatCard
              icon="cash-outline"
              label="Total Invested"
              value={formatNaira(MOCK_STATS.totalInvested)}
              sublabel="Lifetime Total"
            />
            <StatCard
              icon="wallet-outline"
              label="Wallet Balance"
              value={formatNaira(MOCK_STATS.walletBalance)}
              sublabel="Available Cash"
            />
            <StatCard
              icon="people-outline"
              label="Referral Earnings"
              value={formatNaira(MOCK_STATS.referralEarnings)}
              sublabel="Bonus Earned"
            />
          </View>

          <MarketOverviewCard data={MOCK_MARKET} />
          <TierProgressCard progress={MOCK_TIER_PROGRESS} />

          <Text style={styles.sectionTitle}>Equity Partner Advantages</Text>
          <View style={styles.advantagesGrid}>
            {MOCK_ADVANTAGES.map((advantage) => (
              <AdvantageCard key={advantage.id} advantage={advantage} />
            ))}
          </View>
        </View>
      </ScrollView>

      <SideMenu
        visible={menuVisible}
        activeKey="dashboard"
        onClose={() => setMenuVisible(false)}
        onSelect={handleSelectMenuItem}
        onSignOut={handleSignOut}
        isLightMode={isLightMode}
        onToggleLightMode={setIsLightMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 20,
    marginTop: spacing.sm,
  },
  greetingName: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  greetingSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: spacing.xl,
  },
  buyButtonLabel: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 15,
    marginLeft: spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  advantagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
