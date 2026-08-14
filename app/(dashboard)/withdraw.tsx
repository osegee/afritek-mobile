// app/(dashboard)/withdraw.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export default function WithdrawScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>withdraw — coming soon</Text>
    </View>
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
