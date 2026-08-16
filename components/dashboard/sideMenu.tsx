// components/dashboard/SideMenu.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { colors, radius, spacing } from "../../constants/colors";

const MENU_WIDTH = Math.min(280, Dimensions.get("window").width * 0.78);

interface MenuItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "grid-outline",
    route: "/(dashboard)/index",
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: "wallet-outline",
    route: "/(dashboard)/wallet",
  },
  {
    key: "withdrawals",
    label: "Withdrawals",
    icon: "arrow-down-circle-outline",
    route: "/(dashboard)/withdraw",
  },
  {
    key: "referrals",
    label: "Referrals",
    icon: "people-outline",
    route: "/(dashboard)/referral",
  },
  {
    key: "buy-shares",
    label: "Buy shares",
    icon: "add",
    route: "/(utilities)/buy-shares",
  },
  {
    key: "support",
    label: "Support",
    icon: "help-buoy-outline",
    route: "/(utilities)/support",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    route: "/(utilities)/profile",
  },
];

interface Props {
  visible: boolean;
  activeKey: string;
  onClose: () => void;
  onSelect: (key: string) => void;
  onSignOut: () => void;
  isLightMode: boolean;
  onToggleLightMode: (value: boolean) => void;
}

export default function SideMenu({
  visible,
  activeKey,
  onClose,
  onSignOut,
  isLightMode,
  onToggleLightMode,
}: Props) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -MENU_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, overlayOpacity]);

  // Keep mounted so the close animation can play; skip touches when hidden.
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={visible ? "auto" : "none"}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <View style={styles.items}>
          {MENU_ITEMS.map((item) => {
            const active = item.key === activeKey;
            return (
              <Pressable
                key={item.key}
                style={[styles.item, active && styles.itemActive]}
                onPress={() => router.push(item.route)}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={active ? colors.background : colors.textSecondary}
                />
                <Text
                  style={[styles.itemLabel, active && styles.itemLabelActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <View style={styles.lightModeRow}>
            <Text style={styles.lightModeLabel}>Light Mode</Text>
            <Switch
              value={isLightMode}
              onValueChange={onToggleLightMode}
              trackColor={{ false: colors.surfaceAlt, true: colors.goldMuted }}
              thumbColor={isLightMode ? colors.gold : colors.textMuted}
            />
          </View>

          <Pressable style={styles.signOut} onPress={onSignOut}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.signOutLabel}>Sign Out</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingTop: 64,
    paddingHorizontal: spacing.md,
    justifyContent: "space-between",
  },
  items: {
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  itemActive: {
    backgroundColor: colors.gold,
  },
  itemLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  itemLabelActive: {
    color: colors.background,
    fontWeight: "700",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  lightModeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  lightModeLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  signOutLabel: {
    color: colors.danger,
    fontSize: 14,
    marginLeft: spacing.sm,
    fontWeight: "600",
  },
});
