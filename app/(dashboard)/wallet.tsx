// app/(dashboard)/wallet.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export default function WalletScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>wallet — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});