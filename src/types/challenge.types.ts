// ── Core entities ─────────────────────────────────────────────────────────────

export interface Challenge {
  id: string;
  title: string;
  description?: string | null;
  habitId?: string | null;
  targetDays: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  isActive: boolean;
  joinCode?: string; // only visible to creator (mine endpoint)
  createdBy: string;
  participantCount?: number;
  createdAt: string;
}

export interface ChallengeProgress {
  completionsCount: number;
  targetDays: number;
  progressPct: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface JoinedChallenge extends Omit<
  Challenge,
  "joinCode" | "createdBy"
> {
  progress: ChallengeProgress;
  joinedAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  completionsCount: number;
  isCompleted: boolean;
  completedAt?: string | null;
  joinedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  completionsCount: number;
  progressPct: number;
  isCompleted: boolean;
  completedAt: string | null;
  isMe: boolean;
}

// ── API request types ─────────────────────────────────────────────────────────

export interface CreateChallengeRequest {
  title: string;
  description?: string;
  habitId?: string;
  targetDays: number;
  startDate: string;
  isPublic: boolean;
}

// ── API response types ────────────────────────────────────────────────────────

export interface ChallengeListResponse {
  challenges: Challenge[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JoinedChallengeListResponse {
  challenges: JoinedChallenge[];
}

export interface JoinChallengeResponse {
  message: string;
  challengeId: string;
  targetDays: number;
}

export interface CompleteChallengeResponse {
  completionsCount: number;
  targetDays: number;
  progressPct: number;
  isCompleted: boolean;
  completedAt: string | null;
  alreadyCompleted?: boolean;
  message?: string;
}

export interface LeaderboardResponse {
  challengeId: string;
  challengeTitle: string;
  targetDays: number;
  totalParticipants: number;
  leaderboard: LeaderboardEntry[];
}
