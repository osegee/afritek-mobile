// app/(dashboard)/referral.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.text}>referral — coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
