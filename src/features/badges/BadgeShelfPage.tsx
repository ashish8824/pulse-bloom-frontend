import { useMemo } from "react";
import {
  Lock,
  Award,
  Calendar,
  Trophy,
  Flame,
  Brain,
  Leaf,
  Shield,
  Star,
} from "lucide-react";
import { useGetBadgeShelfQuery } from "../../services/badgeApi";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/formatDate";
import type { BadgeType } from "../../types/badge.types";

// ─── Badge metadata ────────────────────────────────────────────────────────────

interface BadgeMeta {
  emoji: string;
  label: string;
  description: string;
  color: string; // Tailwind bg gradient classes
  glow: string; // box-shadow colour (inline style)
  icon: React.ReactNode;
}

const BADGE_META: Record<BadgeType, BadgeMeta> = {
  FIRST_STEP: {
    emoji: "🌱",
    label: "First Step",
    description: "Log your very first mood entry",
    color: "from-emerald-900/60 to-emerald-800/30 border-emerald-700/50",
    glow: "0 0 24px rgba(52,211,153,0.25)",
    icon: <Leaf size={18} className="text-emerald-400" />,
  },
  WEEK_ONE: {
    emoji: "🔥",
    label: "Week One",
    description: "7-day consecutive mood logging streak",
    color: "from-orange-900/60 to-orange-800/30 border-orange-700/50",
    glow: "0 0 24px rgba(251,146,60,0.25)",
    icon: <Flame size={18} className="text-orange-400" />,
  },
  IRON_WILL: {
    emoji: "💪",
    label: "Iron Will",
    description: "30-day streak on any single habit",
    color: "from-blue-900/60 to-blue-800/30 border-blue-700/50",
    glow: "0 0 24px rgba(96,165,250,0.25)",
    icon: <Shield size={18} className="text-blue-400" />,
  },
  MINDFUL_MONTH: {
    emoji: "🧘",
    label: "Mindful Month",
    description: "Log mood every day of a full calendar month",
    color: "from-purple-900/60 to-purple-800/30 border-purple-700/50",
    glow: "0 0 24px rgba(192,132,252,0.25)",
    icon: <Brain size={18} className="text-purple-400" />,
  },
  RESILIENT: {
    emoji: "🌸",
    label: "Resilient",
    description: "Burnout risk drops from High → Low",
    color: "from-pink-900/60 to-pink-800/30 border-pink-700/50",
    glow: "0 0 24px rgba(244,114,182,0.25)",
    icon: <Star size={18} className="text-pink-400" />,
  },
  CENTURION: {
    emoji: "🏅",
    label: "Centurion",
    description: "100-day streak on any single habit",
    color: "from-yellow-900/60 to-yellow-800/30 border-yellow-700/50",
    glow: "0 0 24px rgba(250,204,21,0.25)",
    icon: <Trophy size={18} className="text-yellow-400" />,
  },
};

// ─── Earned Badge Card ─────────────────────────────────────────────────────────

interface EarnedCardProps {
  type: BadgeType;
  earnedAt: string;
  index: number;
}

function EarnedCard({ type, earnedAt, index }: EarnedCardProps) {
  const meta = BADGE_META[type] ?? {
    emoji: "🏆",
    label: type,
    description: "",
    color: "from-gray-800/60 to-gray-700/30 border-gray-600/50",
    glow: "0 0 24px rgba(255,255,255,0.1)",
    icon: <Award size={18} className="text-gray-400" />,
  };

  return (
    <div
      className={`relative rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 ${meta.color}`}
      style={{
        boxShadow: meta.glow,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Earned checkmark */}
      <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
        Earned
      </span>

      {/* Emoji */}
      <div className="text-4xl leading-none select-none">{meta.emoji}</div>

      {/* Label + icon row */}
      <div className="flex items-center gap-2">
        {meta.icon}
        <span className="font-semibold text-white text-sm">{meta.label}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed">
        {meta.description}
      </p>

      {/* Earned date */}
      <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/10">
        <Calendar size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500">{formatDate(earnedAt)}</span>
      </div>
    </div>
  );
}

// ─── Locked Badge Card ─────────────────────────────────────────────────────────

interface LockedCardProps {
  type: BadgeType;
  hint: string;
  index: number;
}

function LockedCard({ type, hint, index }: LockedCardProps) {
  const meta = BADGE_META[type] ?? {
    emoji: "🏆",
    label: type,
    description: "",
  };

  return (
    <div
      className="relative rounded-2xl border border-gray-700/40 bg-gray-900/50 p-5 flex flex-col gap-3 opacity-60"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Lock icon */}
      <span className="absolute top-3 right-3">
        <Lock size={14} className="text-gray-600" />
      </span>

      {/* Emoji — desaturated via grayscale filter */}
      <div className="text-4xl leading-none select-none grayscale opacity-50">
        {meta.emoji}
      </div>

      {/* Label */}
      <span className="font-semibold text-gray-500 text-sm">{meta.label}</span>

      {/* Hint */}
      <p className="text-xs text-gray-600 leading-relaxed">{hint}</p>

      {/* Locked footer */}
      <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/5">
        <Lock size={11} className="text-gray-700" />
        <span className="text-xs text-gray-700">Not yet unlocked</span>
      </div>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ earned, total }: { earned: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((earned / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-gray-400 whitespace-nowrap">
        {earned} / {total}
      </span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BadgeShelfPage() {
  const { data, isLoading, isError } = useGetBadgeShelfQuery();

  const earned = useMemo(() => data?.earned ?? [], [data]);
  const locked = useMemo(() => data?.locked ?? [], [data]);
  const total = earned.length + locked.length;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Award size={40} />}
          title="Couldn't load badges"
          description="Something went wrong fetching your badge shelf. Please try again."
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-600/30">
            <Trophy size={22} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Badge Shelf</h1>
            <p className="text-sm text-gray-400">
              Your achievements and milestones
            </p>
          </div>
        </div>
      </div>

      {/* ── Overall progress ── */}
      {total > 0 && (
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">
              Overall Progress
            </span>
            <span className="text-xs text-brand-400 font-semibold">
              {Math.round((earned.length / total) * 100)}% complete
            </span>
          </div>
          <ProgressBar earned={earned.length} total={total} />
        </div>
      )}

      {/* ── Earned section ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-yellow-400" />
          <h2 className="text-base font-semibold text-white">
            Earned
            {earned.length > 0 && (
              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                {earned.length}
              </span>
            )}
          </h2>
        </div>

        {earned.length === 0 ? (
          <div className="card p-8">
            <EmptyState
              icon={<Trophy size={36} />}
              title="No badges yet"
              description="Complete streaks, log moods consistently, and hit milestones to earn your first badge."
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {earned.map((b, i) => (
              <EarnedCard
                key={b.id}
                type={b.type}
                earnedAt={b.earnedAt}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Locked section ── */}
      {locked.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-400">
              Locked
              <span className="ml-2 text-xs bg-gray-700/50 text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">
                {locked.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {locked.map((b, i) => (
              <LockedCard key={b.type} type={b.type} hint={b.hint} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
