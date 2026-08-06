import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NumericKeypad } from "@/components/auth-keypad";
import { AuthHeader, BackButton, PrimaryButton } from "@/components/auth-ui";
import { AfricanCountries, type Country } from "@/constants/countries";
import { AuthColors, AuthLayout, AuthType } from "@/constants/auth-theme";
import { useAuth } from "@/context/auth-context";

/**
 * Enter phone number — Figma node 1:830. Defaults to Nigeria.
 *
 * Verification (OTP) is skipped for now: the backend only exposes email
 * verification, so we PATCH the phone onto the user's profile and route
 * straight to the success screen.
 */
export default function Phone() {
  const router = useRouter();
  const { updateUserProfile } = useAuth();
  const [digits, setDigits] = useState("");
  const [country, setCountry] = useState<Country>(
    () => AfricanCountries.find((c) => c.iso === "NG") ?? AfricanCountries[0]
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatted = useMemo(
    () => formatPhone(country.dial, digits),
    [country.dial, digits]
  );

  async function handleContinue() {
    // Phone is optional — allow skipping through if empty.
    if (digits.length > 0) {
      setLoading(true);
      try {
        await updateUserProfile({ phone: `${country.dial}${digits}` });
      } catch (err) {
        Alert.alert("Couldn't save phone number", (err as Error).message);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    router.replace("/(auth)/success");
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <BackButton onPress={() => router.back()} style={styles.back} />

        <AuthHeader
          title="Enter your phone number"
          subtitle="You'll receive a 4 digit code for the phone number verification"
        />

        <View style={styles.field}>
          <Pressable
            style={styles.country}
            onPress={() => setPickerOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`Country code, currently ${country.name}`}
            hitSlop={8}
          >
            <Text style={styles.flag}>{country.flag}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={AuthColors.placeholder}
            />
          </Pressable>
          <View style={styles.fieldDivider} />
          <Text style={[styles.phoneText, !digits && styles.phonePlaceholder]}>
            {digits ? formatted : `${country.dial}-000-000-000`}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          label={loading ? "Saving..." : "Continue"}
          onPress={handleContinue}
          disabled={loading}
          style={styles.cta}
        />
        <NumericKeypad
          onKeyPress={(d) =>
            setDigits((prev) => (prev.length < 12 ? prev + d : prev))
          }
          onDelete={() => setDigits((prev) => prev.slice(0, -1))}
        />
      </View>

      <CountryPicker
        visible={pickerOpen}
        selectedIso={country.iso}
        onClose={() => setPickerOpen(false)}
        onSelect={(c) => {
          setCountry(c);
          setPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

/** Bottom-sheet-style list of African countries. */
function CountryPicker({
  visible,
  selectedIso,
  onClose,
  onSelect,
}: {
  visible: boolean;
  selectedIso: string;
  onClose: () => void;
  onSelect: (c: Country) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Select country</Text>
        <FlatList
          data={AfricanCountries}
          keyExtractor={(c) => c.iso}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const active = item.iso === selectedIso;
            return (
              <Pressable
                style={styles.row}
                onPress={() => onSelect(item)}
                accessibilityRole="button"
                accessibilityLabel={item.name}
              >
                <Text style={styles.rowFlag}>{item.flag}</Text>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowDial}>{item.dial}</Text>
                {active ? (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={AuthColors.ctaButton}
                    style={styles.rowCheck}
                  />
                ) : null}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

/** Renders raw digits as {dial}-XXX-XXX-XXXX. */
function formatPhone(dial: string, digits: string) {
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6);
  return [dial, a, b, c].filter(Boolean).join("-");
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AuthColors.background,
    justifyContent: "space-between",
  },
  top: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingTop: AuthLayout.backButtonTop,
  },
  back: {
    marginBottom: AuthLayout.headerGapAfterBack,
  },
  field: {
    marginTop: 32,
    height: AuthLayout.inputHeight,
    borderRadius: AuthLayout.inputBorderRadius,
    backgroundColor: AuthColors.inputBg,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flag: {
    fontSize: 20,
  },
  fieldDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  phoneText: {
    ...AuthType.inputText,
    fontSize: 15,
  },
  phonePlaceholder: {
    color: AuthColors.placeholder,
  },
  bottom: {
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingBottom: 8,
  },
  cta: {
    marginBottom: 24,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "70%",
    backgroundColor: "#111318",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: AuthLayout.horizontalPadding,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    marginBottom: 16,
  },
  sheetTitle: {
    ...AuthType.heading,
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    gap: 12,
  },
  rowFlag: {
    fontSize: 22,
  },
  rowName: {
    ...AuthType.inputText,
    flex: 1,
    fontSize: 15,
  },
  rowDial: {
    ...AuthType.inputText,
    color: AuthColors.placeholder,
    fontSize: 14,
  },
  rowCheck: {
    marginLeft: 8,
  },
});
