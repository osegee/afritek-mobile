import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        {/* "auto" flips the clock/battery/network icons to contrast the
            screen behind them: white on dark backgrounds, dark on light. */}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
