/**
 * Onboarding design tokens.
 *
 * Source of truth: Figma — afritek-mobile
 *   https://www.figma.com/design/oNpDT1fmflXFtriInWqOsG/afritek-mobile
 *   Section "Onboarding Screen" (1:435)
 *     Step 1 → frame 1:449
 *     Step 2 → frame 1:488
 *
 * Values below were read from the Figma MCP server (get_variable_defs +
 * get_design_context) — they are not estimates.
 */

/** The artboard both onboarding frames were designed against. */
export const DESIGN_WIDTH = 390;
export const DESIGN_HEIGHT = 844;

/**
 * Named Figma variables resolved on nodes 1:449 / 1:488.
 * The Figma variable name is given in the comment where it differs.
 */
export const OnboardingColors = {
  /** Primary/400 — full-bleed screen background. */
  background: "#000000",
  /** Others / White, text/primary. */
  white: "#FFFFFF",
  /** Step 1 heading fill. Marginally warmer than pure white. */
  heading: "#E5E2E1",
  /** Body copy — white at 70% opacity. */
  body: "rgba(255, 255, 255, 0.7)",
  /** Next-button fill and active pagination pill. */
  accent: "#FF5F00",
  /** Neutral/2 — inactive pagination pills. */
  paginationInactive: "#494D58",
  /** Chevron glyph inside the next button. */
  onAccent: "#FFFFFF",
};

/**
 * The highlighted word in each heading ("Future", "Equity") carries a
 * horizontal gradient in Figma.
 */
export const OnboardingGradient = {
  from: "#3E52C1",
  to: "#E97216",
};

/**
 * Figma specifies Sora (headings) and Open Sans (body). Neither typeface is
 * bundled in this project yet, so both are left undefined and the platform
 * default is used — the app runs correctly, the letterforms just aren't final.
 *
 * To adopt the real faces:
 *   npx expo install @expo-google-fonts/sora @expo-google-fonts/open-sans
 * load them via useFonts() in app/_layout.tsx, then set:
 *   heading: "Sora_600SemiBold"
 *   body:    "OpenSans_400Regular"
 * Nothing else in the onboarding screens needs to change.
 */
export const OnboardingFonts: { heading?: string; body?: string } = {
  heading: undefined,
  body: undefined,
};

export const OnboardingType = {
  /** Sora SemiBold 32. Line height differs per screen — see each screen file. */
  heading: {
    fontFamily: OnboardingFonts.heading,
    fontSize: 32,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  /** Open Sans Regular 18. Line height differs per screen. */
  body: {
    fontFamily: OnboardingFonts.body,
    fontSize: 18,
    fontWeight: "400" as const,
    textAlign: "center" as const,
    color: OnboardingColors.body,
  },
};

/** Nav-bar control geometry, identical on both frames. */
export const OnboardingControls = {
  nextButtonSize: 48.814,
  chevronSize: 20,
  dotHeight: 4.438,
  dotWidthActive: 22.188,
  dotWidthInactive: 8.875,
  dotGap: 4.438,
};

/** Total steps in the flow — drives the pagination pill count. */
export const ONBOARDING_STEPS = 3;
