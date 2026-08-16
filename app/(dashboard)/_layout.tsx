import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants/colors";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import SideMenu from "../../components/dashboard/sideMenu";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [menuVisible, setMenuVisible] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Derive activeKey dynamically from current pathname
  const activeKey = pathname.includes("wallet")
    ? "wallet"
    : pathname.includes("withdraw")
      ? "withdraw"
      : pathname.includes("referral")
        ? "referral"
        : "dashboard";

  const handleSelectMenuItem = (key: string) => {
    setMenuVisible(false);
    switch (key) {
      case "dashboard":
        router.push("/(dashboard)");
        break;
      case "wallet":
        router.push("/(dashboard)/wallet");
        break;
      case "withdraw":
        router.push("/(dashboard)/withdraw");
        break;
      case "referral":
        router.push("/(dashboard)/referral");
        break;
      default:
        break;
    }
  };

  const handleSignOut = async () => {
    setMenuVisible(false);
    if (signOut) {
      await signOut();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle={isLightMode ? "dark-content" : "light-content"}
        backgroundColor={isLightMode ? "#ffffff" : colors.background}
      />

      {/* Persistent Global Dashboard Header */}
      <DashboardHeader
        user={user}
        onPressMenu={() => setMenuVisible(true)}
        // onPressNotifications={() => router.push("/(utilities)/notifications")}
      />

      <View style={styles.container}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.gold,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="wallet"
            options={{
              title: "Wallet",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="wallet-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="withdraw"
            options={{
              title: "Withdraw",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="referral"
            options={{
              title: "Referral",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>

      {/* Global Drawer Menu with all required props satisfied */}
      <SideMenu
        visible={menuVisible}
        activeKey={activeKey}
        onClose={() => setMenuVisible(false)}
        onSelect={handleSelectMenuItem}
        onSignOut={handleSignOut}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode((prev) => !prev)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
});
