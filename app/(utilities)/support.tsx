import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface SupportTabProps {
  darkMode?: boolean;
  user?: User;
}

interface Ticket {
  id: number;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  date: string;
  category: string;
}

const CATEGORIES = [
  { label: "General Inquiry", value: "general" },
  { label: "Investment", value: "investment" },
  { label: "Account", value: "account" },
  { label: "Finance", value: "finance" },
  { label: "Technical", value: "technical" },
];

const Support: React.FC<SupportTabProps> = ({ darkMode = true, user }) => {
  const insets = useSafeAreaInsets();

  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("general");
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [supportTickets, setSupportTickets] = useState<Ticket[]>([]);

  const theme = {
    bg: darkMode ? "#000000" : "#F9FAFB",
    cardBg: darkMode ? "rgba(24, 24, 27, 0.5)" : "#FFFFFF",
    cardBorder: darkMode ? "#27272A" : "#E5E7EB",
    innerCardBg: darkMode ? "rgba(39, 39, 42, 0.5)" : "#F3F4F6",
    textPrimary: darkMode ? "#FFFFFF" : "#111827",
    textSecondary: darkMode ? "#A1A1AA" : "#6B7280",
    textMuted: darkMode ? "#71717A" : "#9CA3AF",
    inputBg: darkMode ? "#27272A" : "#F9FAFB",
    inputBorder: darkMode ? "#3F3F46" : "#E5E7EB",
    placeholder: darkMode ? "#71717A" : "#9CA3AF",
    accent: "#F59E0B",
    accentMuted: darkMode ? "rgba(245, 158, 11, 0.1)" : "#FEF3C7",
  };

  const handleSubmitTicket = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      Alert.alert("Missing Fields", "Please fill in both subject and message");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTicket: Ticket = {
        id: Date.now(),
        subject: supportSubject,
        status: "open",
        date: "Just now",
        category:
          supportCategory.charAt(0).toUpperCase() + supportCategory.slice(1),
      };

      setSupportTickets((prev) => [newTicket, ...prev]);
      setSuccessMessage(
        "Your support ticket has been submitted successfully! Our team will respond shortly."
      );
      Alert.alert("Success", "Support ticket submitted!");

      setSupportSubject("");
      setSupportMessage("");
      setSupportCategory("general");
    } catch (err) {
      Alert.alert("Error", "Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return {
          icon: "alert-circle-outline" as const,
          label: "Open",
          bg: darkMode ? "rgba(239, 68, 68, 0.2)" : "#FEF2F2",
          text: darkMode ? "#F87171" : "#DC2626",
          border: darkMode ? "rgba(239, 68, 68, 0.2)" : "#FECACA",
        };
      case "in-progress":
        return {
          icon: "time-outline" as const,
          label: "In Progress",
          bg: darkMode ? "rgba(245, 158, 11, 0.2)" : "#FFFBEB",
          text: darkMode ? "#FBBF24" : "#D97706",
          border: darkMode ? "rgba(245, 158, 11, 0.2)" : "#FDE68A",
        };
      case "resolved":
      default:
        return {
          icon: "checkmark-circle-outline" as const,
          label: "Resolved",
          bg: darkMode ? "rgba(34, 197, 94, 0.2)" : "#F0FDF4",
          text: darkMode ? "#4ADE80" : "#16A34A",
          border: darkMode ? "rgba(34, 197, 94, 0.2)" : "#BBF7D0",
        };
    }
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+2349032828299");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@afritek.com");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Support Center
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Get help with your account and investments
        </Text>
      </View>

      {/* Support Channels */}
      <View style={styles.gridContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePhonePress}
          style={[
            styles.channelCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: theme.accentMuted },
            ]}
          >
            <Ionicons name="call-outline" size={22} color={theme.accent} />
          </View>
          <Text style={[styles.channelTitle, { color: theme.textPrimary }]}>
            Phone Support
          </Text>
          <Text style={[styles.channelSub, { color: theme.textSecondary }]}>
            Available 24/7
          </Text>
          <Text style={[styles.channelLink, { color: theme.accent }]}>
            +234 903 282 8299
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleEmailPress}
          style={[
            styles.channelCard,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: theme.accentMuted },
            ]}
          >
            <Ionicons name="mail-outline" size={22} color={theme.accent} />
          </View>
          <Text style={[styles.channelTitle, { color: theme.textPrimary }]}>
            Email Support
          </Text>
          <Text style={[styles.channelSub, { color: theme.textSecondary }]}>
            Response within 24hrs
          </Text>
          <Text style={[styles.channelLink, { color: theme.accent }]}>
            support@afritek.com
          </Text>
        </TouchableOpacity>
      </View>

      {/* Support Tickets List */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={20}
            color={theme.accent}
          />
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Recent Support Tickets
          </Text>
        </View>

        {supportTickets.length > 0 ? (
          <View style={styles.ticketList}>
            {supportTickets.map((ticket) => {
              const badge = getStatusBadge(ticket.status);

              return (
                <View
                  key={ticket.id}
                  style={[
                    styles.ticketCard,
                    {
                      backgroundColor: theme.innerCardBg,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.ticketInfo}>
                    <Text
                      style={[
                        styles.ticketSubject,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {ticket.subject}
                    </Text>
                    <View style={styles.ticketMeta}>
                      <Text
                        style={[
                          styles.ticketMetaText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {ticket.date}
                      </Text>
                      <Text
                        style={[
                          styles.ticketMetaText,
                          { color: theme.textMuted },
                        ]}
                      >
                        {" • "}
                      </Text>
                      <Text
                        style={[
                          styles.ticketMetaText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {ticket.category}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: badge.bg,
                        borderColor: badge.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={badge.icon}
                      size={12}
                      color={badge.text}
                    />
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="help-circle-outline"
              size={40}
              color={theme.textMuted}
            />
            <Text
              style={[
                styles.emptyTextPrimary,
                { color: theme.textSecondary },
              ]}
            >
              No support tickets submitted yet.
            </Text>
            <Text style={[styles.emptyTextSub, { color: theme.textMuted }]}>
              Submitted tickets will appear here automatically.
            </Text>
          </View>
        )}
      </View>

      {/* Submit Ticket Form */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Submit a Ticket
        </Text>

        {Boolean(successMessage) && (
          <View
            style={[
              styles.successAlert,
              { backgroundColor: theme.accentMuted },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={theme.accent}
            />
            <Text style={[styles.successText, { color: theme.accent }]}>
              {successMessage}
            </Text>
            <TouchableOpacity onPress={() => setSuccessMessage("")}>
              <Ionicons name="close" size={16} color={theme.accent} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Subject
          </Text>
          <TextInput
            value={supportSubject}
            onChangeText={setSupportSubject}
            placeholder="Brief description of your issue"
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textPrimary,
              },
            ]}
          />
        </View>

        {/* Custom Category Dropdown */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Category
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
            style={[
              styles.input,
              styles.dropdownTrigger,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
              },
            ]}
          >
            <Text
              style={[styles.dropdownValue, { color: theme.textPrimary }]}
            >
              {CATEGORIES.find((c) => c.value === supportCategory)?.label}
            </Text>
            <Ionicons
              name={isCategoryPickerOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {isCategoryPickerOpen && (
            <View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
            >
              {CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    setSupportCategory(item.value);
                    setIsCategoryPickerOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    supportCategory === item.value && {
                      backgroundColor: theme.accentMuted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: theme.textPrimary },
                      supportCategory === item.value && {
                        color: theme.accent,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Message
          </Text>
          <TextInput
            value={supportMessage}
            onChangeText={setSupportMessage}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={theme.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textPrimary,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmitTicket}
          disabled={submitting}
          style={[
            styles.submitButton,
            { backgroundColor: theme.accent },
            submitting && { opacity: 0.5 },
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons
                name="paper-plane-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 16,
    maxWidth: 768,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    gap: 12,
  },
  channelCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  channelSub: {
    fontSize: 12,
    marginTop: 2,
  },
  channelLink: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  ticketList: {
    gap: 10,
  },
  ticketCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 13,
    fontWeight: "600",
  },
  ticketMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ticketMetaText: {
    fontSize: 11,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyTextPrimary: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
  },
  emptyTextSub: {
    fontSize: 11,
    marginTop: 2,
  },
  successAlert: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  successText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownValue: {
    fontSize: 14,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 13,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Support;