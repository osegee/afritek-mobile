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
          <Stack.Screen name="(dashboard)" />
        </Stack>
        {/* Every current screen (onboarding, auth) is dark, so light icons
            keep the clock/battery/network visible. A future light-background
            group should render its own <StatusBar style="dark" />. */}
        <StatusBar style="light" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
