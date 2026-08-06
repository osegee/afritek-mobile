/**
 * Authentication design tokens.
 *
 * Source: Figma — afritek-mobile, Authentication section (1:664).
 * Extracted from get_design_context(1:696) + screenshots.
 */

export const AuthColors = {
  /** Full-bleed background */
  background: "#000000",
  /** Heading text */
  heading: "#FFFFFF",
  /** Body/subtitle text */
  body: "#666D80",
  /** Input background */
  inputBg: "rgba(255, 255, 255, 0.1)",
  /** Input border (active/filled) */
  inputBorder: "#E97216",
  /** Input border (inactive) */
  inputBorderInactive: "rgba(255, 255, 255, 0.2)",
  /** Input text */
  inputText: "#FFFFFF",
  /** Input placeholder */
  placeholder: "rgba(255, 255, 255, 0.5)",
  /** Primary CTA button */
  ctaButton: "#FF5F00",
  /** CTA button text */
  ctaButtonText: "#FFFFFF",
  /** Social button bg */
  socialButtonBg: "#FFFFFF",
  /** Social button text */
  socialButtonText: "#0D0D12",
  /** Social button border */
  socialButtonBorder: "#C1C7D0",
  /** Divider line */
  divider: "#818898",
  /** Link text */
  link: "#3E52C1",
  /** Link text muted */
  linkMuted: "#818898",
  /** Back button */
  backButton: "#FF5F00",
};

/**
 * Active-input border gradient (indigo → orange).
 *
 * In Figma (Sign up 1:696, Sign in 1:775, phone/verify) the filled input
 * fields carry a diagonal gradient stroke — blue/indigo at the top-right,
 * warming to orange at the bottom-left. Figma's code export flattens this to
 * a solid #E97216, but the rendered design shows the ramp. These stops match
 * the brand gradient used on the onboarding headings (OnboardingGradient).
 */
export const AuthInputGradient = {
  /** Indigo (top-right in the design). */
  from: "#3E52C1",
  /** Orange (bottom-left in the design). */
  to: "#E97216",
  /** Diagonal: top-right → bottom-left. */
  start: { x: 1, y: 0 },
  end: { x: 0, y: 1 },
};

/**
 * Typography — fonts pending.
 * Figma specifies Sora (headings), Open Sans (body), Inter (UI).
 * To adopt: npx expo install @expo-google-fonts/sora @expo-google-fonts/open-sans @expo-google-fonts/inter
 */
export const AuthFonts: {
  heading?: string;
  body?: string;
  ui?: string;
} = {
  heading: undefined, // Sora Bold
  body: undefined, // Open Sans Regular
  ui: undefined, // Inter (Regular/Medium/SemiBold)
};

export const AuthType = {
  /** Sora Bold 20 */
  heading: {
    fontFamily: AuthFonts.heading,
    fontSize: 20,
    fontWeight: "700" as const,
    color: AuthColors.heading,
  },
  /** Open Sans Regular 13, #666D80 */
  subtitle: {
    fontFamily: AuthFonts.body,
    fontSize: 13,
    fontWeight: "400" as const,
    color: AuthColors.body,
    lineHeight: 19.5,
  },
  /** Inter Regular 14 */
  inputText: {
    fontFamily: AuthFonts.ui,
    fontSize: 14,
    fontWeight: "400" as const,
    color: AuthColors.inputText,
  },
  /** Inter Medium 14 */
  buttonText: {
    fontFamily: AuthFonts.ui,
    fontSize: 14,
    fontWeight: "500" as const,
  },
  /** Inter Medium 12 */
  footerText: {
    fontFamily: AuthFonts.ui,
    fontSize: 12,
    fontWeight: "500" as const,
  },
  /** Inter SemiBold 12 */
  footerLink: {
    fontFamily: AuthFonts.ui,
    fontSize: 12,
    fontWeight: "600" as const,
    color: AuthColors.link,
  },
};

/** Common dimensions */
export const AuthLayout = {
  inputHeight: 56,
  inputBorderRadius: 16,
  inputPaddingHorizontal: 16,
  buttonHeight: 56,
  buttonBorderRadius: 16,
  socialButtonHeight: 44,
  socialButtonBorderRadius: 6,
  backButtonSize: 41,
  backButtonRadius: 16,
  horizontalPadding: 24,
  verticalSpacing: 30,
  socialButtonSpacing: 16,
  /**
   * Top spacing below the safe-area inset, derived from Figma (390×844).
   * Figma places the iPhone status bar at 62px, the back button at y=91, and
   * the header block at y=154. SafeAreaView already consumes the status-bar
   * inset, so these offsets are measured from just below it (≈ Figma value − 62).
   */
  backButtonTop: 29, // 91 − 62
  headerTopNoBack: 92, // 154 − 62 (screens without a back button, e.g. Sign up)
  headerGapAfterBack: 22, // back-button bottom (132) → header (154)
};

