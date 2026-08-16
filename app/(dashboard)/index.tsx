// app/(dashboard)/index.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../constants/colors";
import { formatNaira } from "../../lib/format";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import MarketOverviewCard from "../../components/dashboard/MarketOverviewCard";
import TierProgressCard from "../../components/dashboard/TierProgressCard";
import SideMenu from "../../components/dashboard/sideMenu";
import type { InvestorTierProgress } from "../../types/dashboard";
import { useAuth } from "@/context/auth-context";
import { shareAPI, walletAPI, referralAPI } from "@/lib/api/auth";

const MOCK_TIER_PROGRESS: InvestorTierProgress = {
  currentTier: "Gold",
  nextTier: "Platinum",
  amountToNextTier: 500000,
  progressPercent: 55,
};

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, bootstrap } = useAuth();
  const [shareInfo, setShareInfo] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [referral, setReferral] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [sharesRes, walletRes, refRes] = await Promise.all([
          shareAPI.getInfo().catch(() => null),
          walletAPI.get().catch(() => null),
          referralAPI.getMyStats().catch(() => null),
        ]);

        if (isMounted) {
          setShareInfo(sharesRes?.data?.data || null);
          setWallet(walletRes?.data?.data || null);
          setReferral(refRes?.data?.data || null);

          if (bootstrap) {
            await bootstrap();
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectMenuItem = (key: string) => {
    setMenuVisible(false);
    if (key === "dashboard") return;
  };

  const handleSignOut = () => {
    setMenuVisible(false);
  };

  // Safe computed values aligned strictly with Web App logic
  const sharesOwned = Number(user?.sharesOwned ?? 0);
  const totalInvested = Number(user?.totalInvested ?? 0);
  const walletBalance = Number(wallet?.balance ?? 0);
  const referralEarnings = Number(referral?.totalReferralEarnings ?? 0);

  // Sales Progress Calculations
  const soldShares = Number(shareInfo?.soldShares ?? 0);
  const remainingShares = Number(shareInfo?.remainingShares ?? 0);
  const totalShares = soldShares + remainingShares;
  const progressPercent =
    totalShares > 0 ? Math.min((soldShares / totalShares) * 100, 100) : 0;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          user={user}
          onPressMenu={() => setMenuVisible(true)}
          onPressNotifications={() => {}}
        />

        <View style={styles.body}>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.greetingName}>{user?.fullName || "Guest"}</Text>
          <Text style={styles.greetingSubtitle}>
            Track and manage your investments in one place.
          </Text>

          <Pressable style={styles.buyButton} onPress={() => {}}>
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.background}
            />
            <Text style={styles.buyButtonLabel}>Buy Shares</Text>
          </Pressable>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.gold}
              style={{ marginVertical: spacing.xl }}
            />
          ) : (
            <>
              <View style={styles.statsGrid}>
                <StatCard
                  icon="pie-chart-outline"
                  label="Shares Owned"
                  value={sharesOwned.toLocaleString("en-NG")}
                  sublabel="Active Shares"
                />
                <StatCard
                  icon="cash-outline"
                  label="Total Invested"
                  value={formatNaira(totalInvested)}
                  sublabel="Lifetime Total"
                />
                <StatCard
                  icon="wallet-outline"
                  label="Wallet Balance"
                  value={formatNaira(walletBalance)}
                  sublabel="Available Cash"
                />
                <StatCard
                  icon="people-outline"
                  label="Referral Earnings"
                  value={formatNaira(referralEarnings)}
                  sublabel="Bonus Earned"
                />
              </View>

              <MarketOverviewCard data={shareInfo} />

              {/* Shares Sales Progress Card (Ported from Web) */}
              {shareInfo && (
                <View style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <View>
                      <Text style={styles.progressTitle}>
                        Shares Sales Progress
                      </Text>
                      <Text style={styles.progressSubtitle}>
                        {(totalShares - soldShares).toLocaleString("en-NG")}{" "}
                        shares left
                      </Text>
                    </View>
                    <Text style={styles.percentageText}>
                      {progressPercent.toFixed(2)}%
                    </Text>
                  </View>

                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progressPercent}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.progressFooter}>
                    <Text style={styles.progressFooterText}>
                      {soldShares.toLocaleString("en-NG")} shares sold
                    </Text>
                    <Text style={styles.progressFooterText}>
                      {totalShares.toLocaleString("en-NG")} Total Shares
                    </Text>
                  </View>
                </View>
              )}

              <TierProgressCard progress={MOCK_TIER_PROGRESS} />
            </>
          )}
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
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  progressTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  progressSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  percentageText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginVertical: spacing.xs,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  progressFooterText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
