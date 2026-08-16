// constants/colors.ts
// If you already have a colors/theme file in `constants/`, merge these
// tokens into it instead of adding a second file.

export const colors = {
  background: "#0B0B0F",
  surface: "#17171D",
  surfaceAlt: "#1D1D24",
  border: "#26262E",

  gold: "#F59E0B",
  goldMuted: "rgba(227, 166, 62, 0.15)",

  textPrimary: "#FFFFFF",
  textSecondary: "#9B9BA3",
  textMuted: "#6B6B74",

  success: "#3ECF8E",
  danger: "#F59E0B",

  overlay: "rgba(0, 0, 0, 0.6)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
