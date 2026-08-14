// types/dashboard.ts

export type InvestorTier =
  | "Starter"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond";

export const INVESTOR_TIERS: InvestorTier[] = [
  "Starter",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
];

export interface DashboardUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  sharesOwned: number;
  totalInvested: number; // in NGN
  walletBalance: number; // in NGN
  referralEarnings: number; // in NGN
}

export interface ShareMarketOverview {
  pricePerShare: number; // in NGN
  remainingShares: number;
  soldShares: number;
  totalMarketValue: number; // in NGN
}

export interface InvestorTierProgress {
  currentTier: InvestorTier;
  nextTier: InvestorTier | null;
  amountToNextTier: number | null; // in NGN
  progressPercent: number; // 0-100, progress toward nextTier
}

export interface EquityAdvantage {
  id: string;
  icon: string; // Ionicons name
  title: string;
  description: string;
}
