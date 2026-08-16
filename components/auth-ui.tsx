import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { GoogleIcon } from "@/components/google-icon";
import { GradientBorder } from "@/components/gradient-border";
import { AuthColors, AuthLayout, AuthType } from "@/constants/auth-theme";

/**
 * Shared authentication chrome, extracted so every auth screen stays visually
 * in sync. Mirrors the pattern used by components/onboarding-ui.tsx.
 *
 * Source: Figma — afritek-mobile, Authentication section (1:664).
 */

/** Orange rounded-square back button with a left arrow. Figma node 1:698. */
export function BackButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={12}
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
    </Pressable>
  );
}

/** Screen title + subtitle block. */
export function AuthHeader({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <View style={{ alignItems: align === "center" ? "center" : "flex-start" }}>
      <Text style={[styles.heading, align === "center" && styles.centerText]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, align === "center" && styles.centerText]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Pill text input with the design's translucent fill + #F59E0B border.
 * Supports an optional trailing password visibility toggle.
 */
export function AuthTextField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  active,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  active?: boolean;
}) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const showBorderActive = active ?? (focused || value.length > 0);

  const inner = (
    <View
      style={[
        styles.field,
        {
          borderWidth: showBorderActive ? 0 : 1,
          borderColor: AuthColors.inputBorderInactive,
        },
      ]}
    >
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={AuthColors.placeholder}
        secureTextEntry={secureTextEntry && hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setHidden((h) => !h)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
        >
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={AuthColors.placeholder}
          />
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <GradientBorder
      radius={AuthLayout.inputBorderRadius}
      active={showBorderActive}
    >
      {inner}
    </GradientBorder>
  );
}

/** Full-width #F59E0B primary CTA. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

/** White social-provider button (Google / Apple). */
export function SocialButton({
  provider,
  onPress,
}: {
  provider: "google" | "apple";
  onPress: () => void;
}) {
  const label =
    provider === "google" ? "Continue with Google" : "Continue with Apple";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
    >
      {provider === "google" ? (
        <GoogleIcon size={20} />
      ) : (
        <Ionicons name="logo-apple" size={20} color="#000000" />
      )}
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  );
}

/** "Or continue with" divider with flanking rules. */
export function OrDivider({ label = "Or continue with" }: { label?: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/** Inline "prompt + link" footer, e.g. "Already have an account? Sign In". */
export function AuthFooterLink({
  prompt,
  linkLabel,
  onPress,
}: {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{prompt} </Text>
      <Pressable onPress={onPress} hitSlop={8} accessibilityRole="link">
        <Text style={styles.footerLink}>{linkLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: AuthLayout.backButtonSize,
    height: AuthLayout.backButtonSize,
    borderRadius: AuthLayout.backButtonRadius,
    backgroundColor: AuthColors.backButton,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  centerText: {
    textAlign: "center",
  },
  heading: {
    ...AuthType.heading,
  },
  subtitle: {
    ...AuthType.subtitle,
    marginTop: 8,
  },
  field: {
    height: AuthLayout.inputHeight,
    borderRadius: AuthLayout.inputBorderRadius,
    backgroundColor: AuthColors.inputBg,
    borderWidth: 1,
    paddingHorizontal: AuthLayout.inputPaddingHorizontal,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fieldInput: {
    flex: 1,
    ...AuthType.inputText,
    height: "100%",
    padding: 0,
  },
  primaryButton: {
    height: AuthLayout.buttonHeight,
    borderRadius: AuthLayout.buttonBorderRadius,
    backgroundColor: AuthColors.ctaButton,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    ...AuthType.buttonText,
    fontWeight: "600",
    color: AuthColors.ctaButtonText,
  },
  socialButton: {
    height: AuthLayout.socialButtonHeight,
    borderRadius: AuthLayout.socialButtonBorderRadius,
    backgroundColor: AuthColors.socialButtonBg,
    borderWidth: 1,
    borderColor: AuthColors.socialButtonBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialButtonText: {
    ...AuthType.buttonText,
    color: AuthColors.socialButtonText,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(129, 136, 152, 0.4)",
  },
  dividerLabel: {
    ...AuthType.footerText,
    color: AuthColors.divider,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    ...AuthType.footerText,
    color: AuthColors.linkMuted,
  },
  footerLink: {
    ...AuthType.footerLink,
  },
});
