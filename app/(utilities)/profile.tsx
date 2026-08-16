import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { updateProfileSchema } from "@/utils/validation";
import { colors } from "../../constants/colors";

interface ProfileFormData {
  fullName: string;
  phone?: string;
}

interface ProfileScreenProps {
  darkMode?: boolean;
}

export default function ProfileScreen({ darkMode = true }: ProfileScreenProps) {
  const router = useRouter();
  const { user, updateUserProfile, deleteAccount, sendEmailVerification } =
    useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSubmitting(true);
    try {
      await updateUserProfile({
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
      });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              Alert.alert("Account Deleted", "Your account has been deleted.");
              router.replace("/(auth)/sign-in");
            } catch (err: any) {
              Alert.alert("Error", err?.message || "Failed to delete account.");
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleSendVerification = async () => {
    setSendingVerify(true);
    try {
      const response = await sendEmailVerification();
      Alert.alert(
        "Verification Email Sent",
        response?.message || "Please check your inbox.",
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Could not send verification email.",
      );
    } finally {
      setSendingVerify(false);
    }
  };

  const isDark = darkMode;
  const initialLetter = (user?.fullName || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <SafeAreaView
      style={[styles.screen, isDark ? styles.bgDark : styles.bgLight]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[styles.title, isDark ? styles.textWhite : styles.textDark]}
          >
            Profile
          </Text>
          <Text
            style={[
              styles.subtitle,
              isDark ? styles.textMutedDark : styles.textMutedLight,
            ]}
          >
            Manage your account information
          </Text>
        </View>

        {/* User Details Card */}
        <View
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialLetter}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.userName,
                  isDark ? styles.textWhite : styles.textDark,
                ]}
                numberOfLines={1}
              >
                {user?.fullName || "User"}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  isDark ? styles.textMutedDark : styles.textMutedLight,
                ]}
                numberOfLines={1}
              >
                {user?.email}
              </Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                isDark ? styles.badgeDark : styles.badgeLight,
              ]}
            >
              <Feather
                name="shield"
                size={12}
                color={isDark ? "#D4D4D8" : "#4B5563"}
              />
              <Text
                style={[
                  styles.badgeText,
                  isDark ? styles.textMutedDark : styles.textMutedLight,
                ]}
              >
                {user?.role || "user"}
              </Text>
            </View>

            {user?.isVerified ? (
              <View style={[styles.badge, styles.badgeVerified]}>
                <Feather name="check-circle" size={12} color="#4ADE80" />
                <Text style={styles.badgeTextVerified}>Verified</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeUnverified]}>
                <Feather name="alert-circle" size={12} color="#F59E0B" />
                <Text style={styles.badgeTextUnverified}>Unverified</Text>
              </View>
            )}
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Disabled Email */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  isDark ? styles.textMutedDark : styles.textDark,
                ]}
              >
                Email
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.disabledInput,
                    isDark
                      ? styles.inputDarkDisabled
                      : styles.inputLightDisabled,
                  ]}
                  value={user?.email || ""}
                  editable={false}
                />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  isDark ? styles.textMutedDark : styles.textDark,
                ]}
              >
                Full name <Text style={styles.required}>*</Text>
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isDark ? styles.inputDark : styles.inputLight,
                      errors.fullName && styles.inputError,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="John Doe"
                    placeholderTextColor="#71717A"
                  />
                )}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  isDark ? styles.textMutedDark : styles.textDark,
                ]}
              >
                Phone
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isDark ? styles.inputDark : styles.inputLight,
                      errors.phone && styles.inputError,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="+234..."
                    placeholderTextColor="#71717A"
                    keyboardType="phone-pad"
                  />
                )}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  (!isDirty || submitting) && styles.btnDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isDirty || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.btnPrimaryText}>Save changes</Text>
                )}
              </TouchableOpacity>

              {!user?.isVerified && (
                <TouchableOpacity
                  style={[
                    styles.btn,
                    isDark ? styles.btnSecondaryDark : styles.btnSecondaryLight,
                    sendingVerify && styles.btnDisabled,
                  ]}
                  onPress={handleSendVerification}
                  disabled={sendingVerify}
                >
                  {sendingVerify ? (
                    <ActivityIndicator
                      color={isDark ? "#FFFFFF" : "#18181B"}
                      size="small"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.btnSecondaryText,
                        isDark ? styles.textWhite : styles.textDark,
                      ]}
                    >
                      Send verification email
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnWithIcon,
                  isDark ? styles.btnSecondaryDark : styles.btnSecondaryLight,
                ]}
                onPress={() => router.push("/(auth)/change-password")}
              >
                <Feather
                  name="key"
                  size={16}
                  color={isDark ? "#FFFFFF" : "#18181B"}
                />
                <Text
                  style={[
                    styles.btnSecondaryText,
                    isDark ? styles.textWhite : styles.textDark,
                  ]}
                >
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>Danger zone</Text>
          <Text style={styles.dangerSubtitle}>
            Permanently delete your account and all associated data. This cannot
            be undone.
          </Text>

          <TouchableOpacity
            style={[
              styles.btn,
              styles.dangerBtn,
              deleting && styles.btnDisabled,
            ]}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#F87171" size="small" />
            ) : (
              <Text style={styles.dangerBtnText}>Delete account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bgDark: {
    backgroundColor: colors.background || "#09090B",
  },
  bgLight: {
    backgroundColor: "#F4F4F5",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textDark: {
    color: "#18181B",
  },
  textMutedDark: {
    color: "#A1A1AA",
  },
  textMutedLight: {
    color: "#71717A",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: "#18181B",
    borderColor: "#27272A",
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4E4E7",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDark: {
    backgroundColor: "#27272A",
  },
  badgeLight: {
    backgroundColor: "#F4F4F5",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  badgeVerified: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  badgeTextVerified: {
    color: "#4ADE80",
    fontSize: 11,
    fontWeight: "600",
  },
  badgeUnverified: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  badgeTextUnverified: {
    color: "#F59E0B",
    fontSize: 11,
    fontWeight: "600",
  },
  form: {
    marginTop: 14,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  required: {
    color: "#F59E0B",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: "#27272A",
    borderColor: "#3F3F46",
    color: "#FFFFFF",
  },
  inputLight: {
    backgroundColor: "#F4F4F5",
    borderColor: "#E4E4E7",
    color: "#18181B",
  },
  inputDarkDisabled: {
    backgroundColor: "#27272A",
    borderColor: "#3F3F46",
    color: "#71717A",
  },
  inputLightDisabled: {
    backgroundColor: "#E4E4E7",
    borderColor: "#D4D4D8",
    color: "#A1A1AA",
  },
  disabledInput: {
    opacity: 0.7,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  helperText: {
    fontSize: 11,
    color: "#71717A",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
  },
  buttonGroup: {
    gap: 10,
    marginTop: 6,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnWithIcon: {
    flexDirection: "row",
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: "#F59E0B",
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  btnSecondaryDark: {
    backgroundColor: "#27272A",
  },
  btnSecondaryLight: {
    backgroundColor: "#E4E4E7",
  },
  btnSecondaryText: {
    fontWeight: "600",
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  dangerCard: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  dangerTitle: {
    color: "#F87171",
    fontSize: 14,
    fontWeight: "600",
  },
  dangerSubtitle: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  dangerBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  dangerBtnText: {
    color: "#F87171",
    fontWeight: "bold",
    fontSize: 14,
  },
});
