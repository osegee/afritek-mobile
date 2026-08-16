import { shareAPI } from "@/lib/api/auth";
import { useNavigation } from "@react-navigation/native";
import {
  Clock,
  ExternalLink,
  Minus,
  Plus,
  Shield,
  Zap
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BuySharesScreen() {
  const navigation = useNavigation();
  const darkMode = true;

  const [quantity, setQuantity] = useState(1);
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [referenceCode, setReferenceCode] = useState("");
  const [shareInfo, setShareInfo] = useState(null);

  // Loading & process states
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [buying, setBuying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Fetch share market info on mount
  useEffect(() => {
    const fetchMarketInfo = async () => {
      setFetchingInfo(true);
      try {
        const { data } = await shareAPI.getInfo();
        setShareInfo(data.data);
      } catch (err) {
        Alert.alert(
          "Error",
          err.response?.data?.message || "Failed to fetch market info",
        );
      } finally {
        setFetchingInfo(false);
      }
    };
    fetchMarketInfo();
  }, []);

  const sharePrice = shareInfo?.pricePerShare || 1250;
  const subtotal = quantity * sharePrice;
  const platformFee = Math.round(subtotal * 0.01);
  const total = subtotal + platformFee;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Initiate purchase request via API
  const handleBuy = async () => {
    setBuying(true);
    setPaymentData(null);
    try {
      const { data } = await shareAPI.buy({
        quantity: Number(quantity),
        gateway: paymentGateway,
      });

      setPaymentData(data.data);
      Alert.alert(
        "Success",
        data.message || "Purchase initiated successfully!",
      );

      if (data.data?.reference) {
        setReferenceCode(data.data.reference);
      }

      if (data.data?.authorizationUrl) {
        await Linking.openURL(data.data.authorizationUrl);
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  // Verify Paystack transaction via API
  const handleVerifyPayment = async () => {
    if (!referenceCode.trim()) {
      Alert.alert("Required", "Please enter a reference code");
      return;
    }

    setVerifying(true);
    try {
      const { data } = await shareAPI.verifyPaystack(referenceCode);
      Alert.alert("Success", data.message || "Payment verified successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Verification failed",
      );
    } finally {
      setVerifying(false);
    }
  };

  const bgStyle = darkMode ? styles.bgDark : styles.bgLight;
  const cardBgStyle = darkMode ? styles.cardDark : styles.cardLight;
  const textPrimary = darkMode ? styles.textWhite : styles.textDark;
  const textSecondary = darkMode ? styles.textMutedDark : styles.textMutedLight;

  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      {/* Top Header */}
      <View style={[styles.header]}>
        <Text style={[styles.headerTitle, textPrimary]}>
          BUY SHARES
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.subtitle, textSecondary]}>
          Invest in quality companies and grow your portfolio.
        </Text>

        {/* Section 1: Purchase Controls */}
        <View
          style={[
            styles.card,
            cardBgStyle,
            darkMode ? styles.borderDark : styles.borderLight,
          ]}
        >
          <View style={styles.companyRow}>
            <View>
              <Text style={[styles.companyName, textPrimary]}>AfriTek</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.priceText, textSecondary]}>
                  ₦{sharePrice.toLocaleString()}
                </Text>
                <Text style={styles.badgeGreen}> +4.82% Today</Text>
              </View>
            </View>
          </View>

          {/* Market Stats */}
          <View
            style={[
              styles.statsGrid,
              darkMode ? styles.statsBgDark : styles.statsBgLight,
            ]}
          >
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, textSecondary]}>
                Remaining Shares
              </Text>
              <Text style={[styles.statValue, textPrimary]}>
                {fetchingInfo
                  ? "Loading..."
                  : (shareInfo?.remainingShares ?? 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, textSecondary]}>Sold Shares</Text>
              <Text style={[styles.statValue, textPrimary]}>
                {fetchingInfo
                  ? "Loading..."
                  : (shareInfo?.soldShares ?? 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Quantity Controls */}
          <View style={styles.fieldSpacing}>
            <Text
              style={[
                styles.fieldLabel,
                darkMode ? styles.textLabelDark : styles.textLabelLight,
              ]}
            >
              Quantity
            </Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(-1)}
                style={[
                  styles.counterBtn,
                  darkMode ? styles.counterBtnDark : styles.counterBtnLight,
                ]}
              >
                <Minus size={20} color={darkMode ? "#FFFFFF" : "#374151"} />
              </TouchableOpacity>

              <TextInput
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(text) => {
                  const val = parseInt(text.replace(/[^0-9]/g, ""), 10);
                  setQuantity(isNaN(val) || val < 1 ? 1 : val);
                }}
                style={[
                  styles.quantityInput,
                  textPrimary,
                  darkMode ? styles.borderDark : styles.borderLight,
                ]}
              />

              <TouchableOpacity
                onPress={() => handleQuantityChange(1)}
                style={[
                  styles.counterBtn,
                  darkMode ? styles.counterBtnDark : styles.counterBtnLight,
                ]}
              >
                <Plus size={20} color={darkMode ? "#FFFFFF" : "#374151"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Gateway Toggle */}
          <View style={styles.fieldSpacing}>
            <Text
              style={[
                styles.fieldLabel,
                darkMode ? styles.textLabelDark : styles.textLabelLight,
              ]}
            >
              Payment Gateway
            </Text>
            <View style={styles.gatewayContainer}>
              {["paystack", "stripe", "paypal", "wallet"].map((gw) => (
                <TouchableOpacity
                  key={gw}
                  onPress={() => setPaymentGateway(gw)}
                  style={[
                    styles.gatewayChip,
                    paymentGateway === gw
                      ? styles.gatewayChipActive
                      : darkMode
                        ? styles.counterBtnDark
                        : styles.counterBtnLight,
                  ]}
                >
                  <Text
                    style={[
                      styles.gatewayChipText,
                      paymentGateway === gw ? styles.textBlack : textPrimary,
                    ]}
                  >
                    {gw.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subtotal */}
          <View
            style={[
              styles.summaryRow,
              darkMode ? styles.borderDark : styles.borderLight,
            ]}
          >
            <Text style={[styles.totalLabel, textPrimary]}>Total</Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
          </View>

          <TouchableOpacity
            onPress={handleBuy}
            disabled={buying}
            activeOpacity={0.8}
            style={[styles.mainBtn, buying && styles.disabledBtn]}
          >
            {buying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.mainBtnText}>Review Purchase</Text>
            )}
          </TouchableOpacity>

          {/* Features Checklist */}
          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Shield size={16} color="#F59E0B" />
              <Text style={styles.infoText}>
                Bank-level security & encryption
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Zap size={16} color="#F59E0B" />
              <Text style={styles.infoText}>
                Instant order execution on verify
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.infoText}>
                24/7 dedicated institutional support
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Summary & Verification */}
        <View
          style={[
            styles.card,
            cardBgStyle,
            darkMode ? styles.borderDark : styles.borderLight,
          ]}
        >
          <Text style={[styles.cardTitle, textPrimary]}>Purchase Summary</Text>

          <View style={styles.summaryList}>
            <View
              style={[
                styles.summaryRowItem,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            >
              <Text style={textSecondary}>Share Name</Text>
              <Text style={[styles.summaryValue, textPrimary]}>AfriTek</Text>
            </View>
            <View
              style={[
                styles.summaryRowItem,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            >
              <Text style={textSecondary}>Current Price</Text>
              <Text style={[styles.summaryValue, textPrimary]}>
                ₦{sharePrice.toLocaleString()}
              </Text>
            </View>
            <View
              style={[
                styles.summaryRowItem,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            >
              <Text style={textSecondary}>Quantity</Text>
              <Text style={[styles.summaryValue, textPrimary]}>{quantity}</Text>
            </View>
            <View
              style={[
                styles.summaryRowItem,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            >
              <Text style={textSecondary}>Subtotal</Text>
              <Text style={[styles.summaryValue, textPrimary]}>
                ₦{subtotal.toLocaleString()}
              </Text>
            </View>
            <View
              style={[
                styles.summaryRowItem,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            >
              <Text style={textSecondary}>Platform Fee (1%)</Text>
              <Text style={[styles.summaryValue, textPrimary]}>
                ₦{platformFee.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRowItem}>
              <Text style={[styles.totalLabel, textPrimary]}>
                Estimated Total
              </Text>
              <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
            </View>
          </View>

          {/* Payment Link Banner */}
          {paymentData && (
            <View style={styles.paymentBanner}>
              <Text style={styles.bannerTitle}>Payment Initiated</Text>
              <Text style={styles.bannerText}>
                Reference:{" "}
                <Text style={styles.textWhite}>{paymentData.reference}</Text>
              </Text>
              {paymentData.authorizationUrl && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(paymentData.authorizationUrl)}
                  style={styles.externalLinkRow}
                >
                  <Text style={styles.bannerLink}>
                    Complete Payment on Gateway
                  </Text>
                  <ExternalLink size={14} color="#F59E0B" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Verification Section */}
          <View
            style={[
              styles.verifyContainer,
              darkMode ? styles.borderDark : styles.borderLight,
            ]}
          >
            <Text style={[styles.verifyTitle, textPrimary]}>
              Verify Paystack Payment
            </Text>
            <Text style={[styles.verifyDesc, textSecondary]}>
              If you&apos;ve completed the payment via Paystack, enter your
              reference code below.
            </Text>

            <TextInput
              value={referenceCode}
              onChangeText={setReferenceCode}
              placeholder="e.g. SHR_ABC123"
              placeholderTextColor={darkMode ? "#71717A" : "#9CA3AF"}
              style={[
                styles.input,
                textPrimary,
                darkMode ? styles.inputDark : styles.inputLight,
                darkMode ? styles.borderDark : styles.borderLight,
              ]}
            />

            <TouchableOpacity
              onPress={handleVerifyPayment}
              disabled={verifying}
              activeOpacity={0.8}
              style={[styles.verifyBtn, verifying && styles.disabledBtn]}
            >
              {verifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyBtnText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: "#09090B" },
  bgLight: { backgroundColor: "#F9FAFB" },
  cardDark: { backgroundColor: "#18181B" },
  cardLight: { backgroundColor: "#FFFFFF" },
  borderDark: { borderColor: "#27272A" },
  borderLight: { borderColor: "#E5E7EB" },
  textWhite: { color: "#FFFFFF" },
  textDark: { color: "#111827" },
  textBlack: { color: "#000000" },
  textMutedDark: { color: "#A1A1AA" },
  textMutedLight: { color: "#6B7280" },
  textLabelDark: { color: "#D4D4D8" },
  textLabelLight: { color: "#374151" },
  statsBgDark: { backgroundColor: "#27272A" },
  statsBgLight: { backgroundColor: "#F3F4F6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 8, borderRadius: 12, marginRight: 12 },
  backBtnDark: { backgroundColor: "#18181B" },
  backBtnLight: { backgroundColor: "#E5E7EB" },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  scrollContent: { padding: 16, gap: 16 },
  subtitle: { fontSize: 14, marginBottom: 4 },

  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16 },
  companyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 8 },
  companyName: { fontSize: 18, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  priceText: { fontSize: 14 },
  badgeGreen: { color: "#22C55E", fontWeight: "600", fontSize: 12 },

  statsGrid: { flexDirection: "row", borderRadius: 12, padding: 12, gap: 12 },
  statBox: { flex: 1 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },

  fieldSpacing: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: "500" },

  quantityRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  counterBtn: { padding: 10, borderRadius: 12 },
  counterBtnDark: { backgroundColor: "#27272A" },
  counterBtnLight: { backgroundColor: "#E5E7EB" },
  quantityInput: {
    width: 70,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    borderBottomWidth: 1,
    paddingVertical: 4,
  },

  gatewayContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gatewayChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  gatewayChipActive: { backgroundColor: "#F59E0B" },
  gatewayChipText: { fontSize: 12, fontWeight: "700" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#F59E0B" },

  mainBtn: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  mainBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  disabledBtn: { opacity: 0.5 },

  infoGroup: { gap: 8, marginTop: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 12, color: "#71717A" },

  cardTitle: { fontSize: 16, fontWeight: "700" },
  summaryList: { gap: 10 },
  summaryRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  summaryValue: { fontSize: 14, fontWeight: "500" },

  paymentBanner: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  bannerTitle: { color: "#F59E0B", fontWeight: "700", fontSize: 12 },
  bannerText: { color: "#A1A1AA", fontSize: 12 },
  externalLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  bannerLink: { color: "#F59E0B", fontWeight: "700", fontSize: 12 },

  verifyContainer: { paddingTop: 12, borderTopWidth: 1, gap: 8 },
  verifyTitle: { fontSize: 14, fontWeight: "600" },
  verifyDesc: { fontSize: 12 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  inputDark: { backgroundColor: "#27272A" },
  inputLight: { backgroundColor: "#FFFFFF" },
  verifyBtn: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
});
