import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UtilitiesLayout() {
  const router = useRouter();
  const darkMode = true;

  const bgStyle = darkMode ? styles.bgDark : styles.bgLight;
  const textPrimary = darkMode ? styles.textWhite : styles.textDark;
  return (
    <SafeAreaView style={[styles.container, bgStyle]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          darkMode ? styles.borderDark : styles.borderLight,
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            darkMode ? styles.backBtnDark : styles.backBtnLight,
          ]}
        >
          <ChevronLeft size={24} color={darkMode ? "#FFFFFF" : "#111827"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, textPrimary]}>AFRITEK</Text>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#000000" },
        }}
      >
        <Stack.Screen name="buy-shares" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="support" />
      </Stack>
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
