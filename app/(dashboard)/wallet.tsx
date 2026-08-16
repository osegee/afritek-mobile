import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { walletAPI } from "@/lib/api/auth";

interface RecentCommission {
  id: string | number;
  level: number;
  amount: number;
  baseAmount: number;
  rate: number;
  createdAt: string;
}

interface WalletData {
  balance?: number;
  totalReferralEarnings?: number;
  totalInvested?: number;
  totalReturns?: number;
  recentCommissions?: RecentCommission[];
}

export default function WalletScreen() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [depositing, setDepositing] = useState<boolean>(false);

  // Form State
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositDescription, setDepositDescription] = useState<string>("");

  const fetchWallet = useCallback(async () => {
    try {
      const { data } = await walletAPI.get();
      setWallet(data?.data || null);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to load wallet info",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
  };

  const handleDeposit = async () => {
    const amountNum = Number(depositAmount);
    if (!depositAmount || amountNum <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid deposit amount");
      return;
    }

    setDepositing(true);
    try {
      const { data } = await walletAPI.deposit({
        amount: amountNum,
        description: depositDescription,
      });

      Alert.alert("Success", data?.message || "Deposit successful!");
      setDepositAmount("");
      setDepositDescription("");
      fetchWallet();
    } catch (err: any) {
      Alert.alert(
        "Deposit Failed",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setDepositing(false);
    }
  };

  const walletStats = [
    {
      label: "Available Balance",
      value: `₦${(wallet?.balance ?? 0).toLocaleString()}`,
      icon: "credit-card" as const,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Referral Earnings",
      value: `₦${(wallet?.totalReferralEarnings ?? 0).toLocaleString()}`,
      icon: "gift" as const,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Total Invested",
      value: `₦${(wallet?.totalInvested ?? 0).toLocaleString()}`,
      icon: "trending-up" as const,
      color: "#A855F7",
      bg: "rgba(168, 85, 247, 0.1)",
    },
    {
      label: "Total Returns",
      value: `₦${(wallet?.totalReturns ?? 0).toLocaleString()}`,
      icon: "dollar-sign" as const,
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.1)",
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
            <Text style={styles.title}>Wallet</Text>
            <Text style={styles.subtitle}>
              Manage your funds and transactions
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchWallet}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={14} color="#FFFFFF" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {walletStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>
                  {loading ? "..." : stat.value}
                </Text>
              </View>
              <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                <Feather name={stat.icon} size={18} color={stat.color} />
              </View>
            </View>
          ))}
        </View>

        {/* Deposit Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deposit Funds</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              placeholderTextColor="#71717A"
              value={depositDescription}
              onChangeText={setDepositDescription}
            />
          </View>

          <TouchableOpacity
            style={[styles.depositButton, depositing && { opacity: 0.6 }]}
            onPress={handleDeposit}
            disabled={depositing}
          >
            {depositing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Feather name="upload" size={16} color="#FFFFFF" />
                <Text style={styles.depositButtonText}>Deposit</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Commissions List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Commissions</Text>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#F59E0B"
              style={{ marginVertical: 20 }}
            />
          ) : wallet?.recentCommissions &&
            wallet.recentCommissions.length > 0 ? (
            <View style={styles.commissionList}>
              {wallet.recentCommissions.map((c, idx) => (
                <View key={c.id || idx} style={styles.commissionRow}>
                  <View style={styles.commIconBox}>
                    <Text style={styles.commLevelText}>L{c.level}</Text>
                  </View>

                  <View style={styles.commDetails}>
                    <Text style={styles.commMetaText}>
                      Base: ₦{c.baseAmount?.toLocaleString()} ({c.rate}%)
                    </Text>
                    <Text style={styles.commDateText}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.commAmount}>
                    +₦{c.amount?.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="corner-down-right" size={28} color="#52525B" />
              <Text style={styles.emptyText}>
                No recent commission activity recorded.
              </Text>
            </View>
          )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#27272A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#D4D4D8",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#27272A",
    borderColor: "#3F3F46",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFFFFF",
    fontSize: 14,
  },
  depositButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
  },
  depositButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  commissionList: {
    gap: 10,
  },
  commissionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  commIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  commLevelText: {
    color: "#F59E0B",
    fontWeight: "bold",
    fontSize: 12,
  },
  commDetails: {
    flex: 1,
  },
  commMetaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  commDateText: {
    color: "#A1A1AA",
    fontSize: 11,
    marginTop: 2,
  },
  commAmount: {
    color: "#10B981",
    fontWeight: "bold",
    fontSize: 14,
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
});
