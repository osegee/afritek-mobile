import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Clipboard,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { referralAPI } from "@/lib/api/auth";

interface ReferralStats {
  referralCode?: string;
  referralLink?: string;
  directReferrals?: number;
  secondLevelReferrals?: number;
  totalReferralEarnings?: number;
  balance?: number;
  rates?: {
    level1?: string;
    level2?: string;
  };
  level1Users?: [{
    uid?: string;
    _id?: string;
    fullName?: string;
    email?: string;
  }];
}

export default function ReferralScreen() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchReferralStats = useCallback(async () => {
    try {
      const res = await referralAPI.getMyStats();
      setStats(res.data?.data || null);
    } catch (err: any) {
      console.error(
        err?.response?.data?.message || "Failed to load referral stats",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReferralStats();
  }, [fetchReferralStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReferralStats();
  };

  const referralLink = stats?.referralCode
    ? `https://afritek.vercel.app/register?ref=${stats.referralCode}`
    : "No link generated";

  // Native React Native Clipboard
  const handleCopy = () => {
    if (stats?.referralCode) {
      Clipboard.setString(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Optional: Native Share Sheet
  const handleShare = async () => {
    if (stats?.referralCode) {
      try {
        await Share.share({
          message: `Join me using my referral link: ${referralLink}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const statCards = [
    {
      label: "Direct Referrals",
      value: stats?.directReferrals ?? 0,
      icon: "users" as const,
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "2nd Level",
      value: stats?.secondLevelReferrals ?? 0,
      icon: "users" as const,
      color: "#A855F7",
      bg: "rgba(168, 85, 247, 0.1)",
    },
    {
      label: "Total Earnings",
      value: `₦${(stats?.totalReferralEarnings ?? 0).toLocaleString()}`,
      icon: "gift" as const,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Wallet Balance",
      value: `₦${(stats?.balance ?? 0).toLocaleString()}`,
      icon: "credit-card" as const,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
  ];

  const benefits = [
    {
      icon: "gift" as const,
      title: "Instant Commissions",
      desc: "Earn up to 15% instant commission whenever your referrals invest.",
    },
    {
      icon: "users" as const,
      title: "2-Tier Referral Tree",
      desc: "Earn secondary bonuses when your referrals invite others to join.",
    },
    {
      icon: "trending-up" as const,
      title: "Passive Growth",
      desc: "Automatically credit commissions straight into your active wallet.",
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F59E0B"
          />
        }
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Referrals</Text>
            <Text style={styles.subtitle}>
              Invite friends and earn recurring rewards
            </Text>
          </View>
          <View style={styles.badge}>
            <Feather name="award" size={14} color="#F59E0B" />
            <Text style={styles.badgeText}>
              L1: {stats?.rates?.level1 || "15%"} · L2:{" "}
              {stats?.rates?.level2 || "5%"}
            </Text>
          </View>
        </View>

        {/* Link & Code Box */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Referral Link</Text>
          <View style={styles.linkRow}>
            <View style={styles.linkContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="#F59E0B" />
              ) : (
                <Text style={styles.linkText} numberOfLines={1}>
                  {referralLink}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.copyButton, copied && styles.copyButtonActive]}
              onPress={handleCopy}
              disabled={!stats?.referralCode || loading}
            >
              <Feather
                name={copied ? "check" : "copy"}
                size={16}
                color={copied ? "#10B981" : "#F59E0B"}
              />
              <Text
                style={[styles.copyButtonText, copied && { color: "#10B981" }]}
              >
                {copied ? "Copied" : "Copy"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              disabled={!stats?.referralCode || loading}
            >
              <Feather name="share-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Referral Code: </Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{stats?.referralCode || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((item, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>
                  {loading ? "..." : item.value}
                </Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={18} color={item.color} />
              </View>
            </View>
          ))}
        </View>

        {/* Commission Rates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Commission Rates</Text>
          <View style={styles.rateGrid}>
            <View style={styles.rateBox}>
              <View style={[styles.tierCircle, { backgroundColor: "#F59E0B" }]}>
                <Text style={styles.tierCircleText}>1</Text>
              </View>
              <Text style={styles.rateValue}>
                {stats?.rates?.level1 || "15%"}
              </Text>
              <Text style={styles.rateLabel}>Level 1 Direct</Text>
            </View>

            <View style={styles.rateBox}>
              <View style={[styles.tierCircle, { backgroundColor: "#3B82F6" }]}>
                <Text style={styles.tierCircleText}>2</Text>
              </View>
              <Text style={styles.rateValue}>
                {stats?.rates?.level2 || "5%"}
              </Text>
              <Text style={styles.rateLabel}>Level 2 Secondary</Text>
            </View>
          </View>
        </View>

        {/* Direct Referrals List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Direct Referred Users</Text>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#F59E0B"
              style={{ marginVertical: 20 }}
            />
          ) : stats?.level1Users && stats.level1Users.length > 0 ? (
            <View style={styles.userList}>
              {stats.level1Users.map((refUser, idx) => (
                <View
                  key={refUser.uid || refUser._id || idx}
                  style={styles.userCard}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {refUser.fullName?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {refUser.fullName || "Anonymous User"}
                    </Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                      {refUser.email || "No email provided"}
                    </Text>
                  </View>
                  <View style={styles.levelTag}>
                    <Feather name="user-check" size={12} color="#10B981" />
                    <Text style={styles.levelTagText}>Level 1</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="users" size={32} color="#52525B" />
              <Text style={styles.emptyText}>
                No direct referrals registered yet.
              </Text>
              <Text style={styles.emptySubtext}>
                Share your link to begin earning bonuses.
              </Text>
            </View>
          )}
        </View>

        {/* Benefits Overview */}
        <View style={[styles.card, styles.benefitsCard]}>
          <Text style={styles.cardTitle}>Referral Benefits</Text>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, i) => (
              <View key={i} style={styles.benefitBox}>
                <Feather
                  name={benefit.icon}
                  size={22}
                  color="#F59E0B"
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background || "#09090B",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  headerRow: {
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  badgeText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#18181B",
    borderColor: "#27272A",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  linkContainer: {
    flex: 1,
    backgroundColor: "#27272A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  linkText: {
    color: "#D4D4D8",
    fontSize: 12,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  copyButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  copyButtonText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
  },
  shareButton: {
    backgroundColor: "#27272A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  codeLabel: {
    color: "#A1A1AA",
    fontSize: 13,
  },
  codeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "#27272A",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#18181B",
    borderColor: "#27272A",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: "#A1A1AA",
    fontSize: 12,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  iconBox: {
    padding: 8,
    borderRadius: 10,
  },
  rateGrid: {
    flexDirection: "row",
    gap: 12,
  },
  rateBox: {
    flex: 1,
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  tierCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tierCircleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  rateValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  rateLabel: {
    color: "#A1A1AA",
    fontSize: 11,
    marginTop: 2,
  },
  userList: {
    gap: 10,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3F3F46",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  userEmail: {
    color: "#A1A1AA",
    fontSize: 11,
  },
  levelTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelTagText: {
    color: "#10B981",
    fontSize: 10,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 6,
  },
  emptyText: {
    color: "#A1A1AA",
    fontSize: 13,
  },
  emptySubtext: {
    color: "#71717A",
    fontSize: 11,
  },
  benefitsCard: {
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  benefitsContainer: {
    gap: 10,
  },
  benefitBox: {
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 12,
  },
  benefitTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  benefitDesc: {
    color: "#A1A1AA",
    fontSize: 11,
    marginTop: 2,
  },
});
