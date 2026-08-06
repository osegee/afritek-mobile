import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AuthInputGradient } from "@/constants/auth-theme";

/**
 * Paints a 1px indigo→orange gradient stroke around its children, matching the
 * active-input border in Figma (Sign up 1:696 / Sign in 1:775 / phone / verify).
 *
 * React Native can't stroke a border with a gradient directly, so this renders
 * a LinearGradient as the outer layer and then covers the interior with an
 * OPAQUE underlay (`baseFill`) inset by `borderWidth`. That underlay blocks the
 * gradient everywhere except the 1px rim — so the gradient reads as a *border*,
 * not a fill. Children (which may carry their own translucent tint) render on
 * top of the underlay, so a translucent input background composites over the
 * opaque base to the exact design colour instead of over the gradient.
 *
 * @param radius       outer corner radius (inner radius is radius - borderWidth)
 * @param borderWidth  stroke thickness (default 1)
 * @param baseFill     opaque interior colour that blocks gradient bleed-through;
 *                     defaults to the screen background (#000000)
 * @param active       when false, no gradient is drawn (children render bare)
 */
export function GradientBorder({
  children,
  radius,
  borderWidth = 1,
  baseFill = "#000000",
  active = true,
  style,
}: {
  children: React.ReactNode;
  radius: number;
  borderWidth?: number;
  baseFill?: string;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  if (!active) {
    return <View style={style}>{children}</View>;
  }

  const innerRadius = Math.max(radius - borderWidth, 0);

  return (
    <LinearGradient
      colors={[AuthInputGradient.from, AuthInputGradient.to]}
      start={AuthInputGradient.start}
      end={AuthInputGradient.end}
      style={[{ borderRadius: radius, padding: borderWidth }, style]}
    >
      {/* Opaque underlay: hides the gradient so only the rim remains visible. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            margin: borderWidth,
            borderRadius: innerRadius,
            backgroundColor: baseFill,
          },
        ]}
      />
      <View style={{ flex: 1, borderRadius: innerRadius, overflow: "hidden" }}>
        {children}
      </View>
    </LinearGradient>
  );
}
