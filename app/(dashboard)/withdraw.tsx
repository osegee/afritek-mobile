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
import { withdrawalAPI } from "@/lib/api/auth";

interface WithdrawalItem {
  id?: string | number;
  withdrawalId?: string | number;
  amount: number;
  status: "pending" | "completed" | "approved" | "rejected" | string;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  createdAt?: string;
}

interface WithdrawScreenProps {
  user?: {
    role?: string;
    [key: string]: any;
  };
}

export default function WithdrawScreen({ user }: WithdrawScreenProps) {
  const isAdmin = user?.role === "admin";

  // State Management
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [pending, setPending] = useState<WithdrawalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | number | null>(
    null,
  );

  // Form State
  const [form, setForm] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  const loadWithdrawals = useCallback(async () => {
    try {
      const { data } = await withdrawalAPI.getMine();
      const userWithdrawals = data?.data?.withdrawals || data?.data || [];
      setWithdrawals(Array.isArray(userWithdrawals) ? userWithdrawals : []);

      if (isAdmin) {
        const pendRes = await withdrawalAPI.getPending();
        setPending(pendRes.data?.data || []);
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to load withdrawal history",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWithdrawals();
  };

  const handleRequest = async () => {
    const amountNum = Number(form.amount);
    if (!form.amount || amountNum < 1000) {
      Alert.alert("Invalid Input", "Please enter an amount of at least ₦1,000");
      return;
    }
    if (
      !form.accountName ||
      !form.accountNumber ||
      !form.bankCode ||
      !form.bankName
    ) {
      Alert.alert("Missing Fields", "Please fill in all account details");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await withdrawalAPI.request({
        ...form,
        amount: amountNum,
      });

      Alert.alert("Success", data?.message || "Withdrawal request submitted!");
      setForm({
        amount: "",
        accountName: "",
        accountNumber: "",
        bankCode: "",
        bankName: "",
      });
      loadWithdrawals();
    } catch (err: any) {
      Alert.alert(
        "Request Failed",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcess = async (
    id: string | number,
    action: "approve" | "reject",
  ) => {
    setProcessingId(id);
    try {
      const { data } = await withdrawalAPI.process(id, {
        action,
        note:
          action === "approve"
            ? "Paid via bank transfer"
            : "Invalid account details",
      });

      Alert.alert(
        "Success",
        data?.message || `Request ${action}d successfully`,
      );
      loadWithdrawals();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || `Failed to ${action} request`,
      );
    } finally {
      setProcessingId(null);
    }
  };

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
            <Text style={styles.title}>Withdrawals</Text>
            <Text style={styles.subtitle}>
              Request and track your withdrawals
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadWithdrawals}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={14} color="#FFFFFF" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Request Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request Withdrawal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Amount (₦) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount (min ₦1,000)"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={(val) =>
                setForm((prev) => ({ ...prev, amount: val }))
              }
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>
                Account Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Account holder"
                placeholderTextColor="#71717A"
                value={form.accountName}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, accountName: val }))
                }
              />
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>
                Account Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="10 digit number"
                placeholderTextColor="#71717A"
                keyboardType="numeric"
                maxLength={10}
                value={form.accountNumber}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, accountNumber: val }))
                }
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>
                Bank Code <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 058"
                placeholderTextColor="#71717A"
                value={form.bankCode}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, bankCode: val }))
                }
              />
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.inputLabel}>
                Bank Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. GTBank"
                placeholderTextColor="#71717A"
                value={form.bankName}
                onChangeText={(val) =>
                  setForm((prev) => ({ ...prev, bankName: val }))
                }
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleRequest}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Feather name="arrow-up-right" size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Withdrawal History Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Withdrawals</Text>

          {loading ? (
            <ActivityIndicator
              size="small"
              color="#F59E0B"
              style={{ marginVertical: 20 }}
            />
          ) : withdrawals.length > 0 ? (
            <View style={styles.historyList}>
              {withdrawals.map((w, idx) => {
                const reqId = w.withdrawalId || w.id || idx;
                const isApproved =
                  w.status === "completed" || w.status === "approved";
                const isPending = w.status === "pending";

                return (
                  <View key={reqId} style={styles.historyRow}>
                    <View style={styles.historyTop}>
                      <Text style={styles.historyAmount}>
                        ₦{(w.amount || 0).toLocaleString()}
                      </Text>

                      <View
                        style={[
                          styles.badge,
                          isApproved
                            ? styles.badgeApproved
                            : isPending
                              ? styles.badgePending
                              : styles.badgeRejected,
                        ]}
                      >
                        <Feather
                          name={
                            isApproved
                              ? "check-circle"
                              : isPending
                                ? "clock"
                                : "x-circle"
                          }
                          size={12}
                          color={
                            isApproved
                              ? "#4ADE80"
                              : isPending
                                ? "#F59E0B"
                                : "#F87171"
                          }
                        />
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color: isApproved
                                ? "#4ADE80"
                                : isPending
                                  ? "#F59E0B"
                                  : "#F87171",
                            },
                          ]}
                        >
                          {w.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.historyMeta}>
                      {w.bankName || w.bankCode} · {w.accountNumber || "N/A"}
                    </Text>

                    <Text style={styles.historyDate}>
                      {w.createdAt
                        ? new Date(w.createdAt).toLocaleDateString()
                        : "-"}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="credit-card" size={32} color="#3F3F46" />
              <Text style={styles.emptyText}>
                No withdrawals requested yet.
              </Text>
            </View>
          )}
        </View>

        {/* Admin Panel (Visible Only to Admins) */}
        {isAdmin && (
          <View style={styles.card}>
            <View style={styles.adminHeader}>
              <Feather name="shield" size={18} color="#F59E0B" />
              <Text style={styles.cardTitle}>Pending Approvals (Admin)</Text>
            </View>

            {pending.length === 0 ? (
              <Text style={styles.emptyText}>
                No pending withdrawal requests.
              </Text>
            ) : (
              <View style={styles.adminList}>
                {pending.map((w) => {
                  const itemReqId = w.withdrawalId || w.id;
                  const isProcessing = processingId === itemReqId;

                  return (
                    <View key={itemReqId} style={styles.adminCard}>
                      <View style={styles.historyTop}>
                        <Text style={styles.historyAmount}>
                          ₦{(w.amount || 0).toLocaleString()}
                        </Text>
                        <View style={[styles.badge, styles.badgePending]}>
                          <Text
                            style={[styles.badgeText, { color: "#F59E0B" }]}
                          >
                            Pending
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.adminAccountName}>
                        {w.accountName}
                      </Text>
                      <Text style={styles.historyMeta}>
                        {w.accountNumber} · {w.bankName || w.bankCode}
                      </Text>

                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.approveBtn]}
                          onPress={() =>
                            itemReqId && handleProcess(itemReqId, "approve")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.actionBtnText}>Approve</Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.actionBtn, styles.rejectBtn]}
                          onPress={() =>
                            itemReqId && handleProcess(itemReqId, "reject")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text style={styles.actionBtnText}>Reject</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
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
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#D4D4D8",
    marginBottom: 6,
  },
  required: {
    color: "#F59E0B",
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
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  historyList: {
    gap: 10,
  },
  historyRow: {
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeApproved: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  badgePending: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  badgeRejected: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  historyMeta: {
    color: "#A1A1AA",
    fontSize: 12,
  },
  historyDate: {
    color: "#71717A",
    fontSize: 10,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    color: "#A1A1AA",
    fontSize: 13,
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adminList: {
    gap: 12,
  },
  adminCard: {
    backgroundColor: "#27272A",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  adminAccountName: {
    color: "#E4E4E7",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveBtn: {
    backgroundColor: "#16A34A",
  },
  rejectBtn: {
    backgroundColor: "#DC2626",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
