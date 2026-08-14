// components/dashboard/DashboardHeader.tsx
import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../constants/colors";
import type { DashboardUser } from "../../types/dashboard";

interface Props {
  user: DashboardUser;
  onPressMenu: () => void;
  onPressNotifications: () => void;
  hasUnreadNotifications?: boolean;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function DashboardHeader({
  user,
  onPressMenu,
  onPressNotifications,
  hasUnreadNotifications,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.profile} onPress={onPressMenu} hitSlop={8}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{getInitials(user.name)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          style={styles.iconButton}
          onPress={onPressNotifications}
          hitSlop={8}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.textPrimary}
          />
          {hasUnreadNotifications && <View style={styles.badge} />}
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onPressMenu} hitSlop={8}>
          <Ionicons name="menu-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.goldMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarInitials: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 14,
  },
  name: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.surface,
  },
});
