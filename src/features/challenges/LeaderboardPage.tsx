import { useParams, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Target,
  Users,
  Calendar,
  Crown,
  Medal,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { clsx } from "clsx";
import { useGetLeaderboardQuery } from "../../services/challengeApi";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatDate, formatDateTime } from "../../utils/formatDate";

// ── Rank icon ─────────────────────────────────────────────────────────────────

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={18} className="text-gray-300" />;
  if (rank === 3) return <Medal size={18} className="text-amber-600" />;
  return (
    <span className="text-sm font-bold text-gray-500 w-[18px] text-center">
      {rank}
    </span>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function MiniProgress({ pct, isMe }: { pct: number; isMe: boolean }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500",
          clamped === 100
            ? "bg-emerald-500"
            : isMe
              ? "bg-gradient-to-r from-brand-600 to-brand-400"
              : "bg-gray-600",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ── Leaderboard row ───────────────────────────────────────────────────────────

interface RowProps {
  rank: number;
  name: string;
  completionsCount: number;
  progressPct: number;
  targetDays: number;
  isCompleted: boolean;
  completedAt: string | null;
  isMe: boolean;
}

function LeaderboardRow({
  rank,
  name,
  completionsCount,
  progressPct,
  targetDays,
  isCompleted,
  completedAt,
  isMe,
}: RowProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors",
        isMe
          ? "bg-brand-600/10 border-brand-600/30"
          : rank <= 3
            ? "bg-gray-800/60 border-gray-700/50"
            : "bg-gray-900/40 border-gray-800/40",
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-7 flex items-center justify-center">
        <RankIcon rank={rank} />
      </div>

      {/* Avatar */}
      <div
        className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
          isMe ? "bg-brand-600 text-white" : "bg-gray-700 text-gray-300",
        )}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Name + progress */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-sm font-medium truncate",
              isMe ? "text-brand-300" : "text-gray-200",
            )}
          >
            {name}
            {isMe && (
              <span className="ml-1.5 text-xs text-brand-500">(you)</span>
            )}
          </span>
          {isCompleted && (
            <CheckCircle2
              size={14}
              className="text-emerald-400 flex-shrink-0"
            />
          )}
        </div>
        <MiniProgress pct={progressPct} isMe={isMe} />
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right space-y-0.5">
        <p className="text-sm font-semibold text-white">
          {completionsCount}
          <span className="text-gray-600 font-normal text-xs">
            /{targetDays}
          </span>
        </p>
        {isCompleted && completedAt ? (
          <p className="text-xs text-emerald-500 flex items-center justify-end gap-1">
            <CheckCircle2 size={10} />
            {formatDate(completedAt)}
          </p>
        ) : (
          <p className="text-xs text-gray-600">{progressPct}%</p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetLeaderboardQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Trophy size={40} />}
          title="Leaderboard unavailable"
          description="This challenge doesn't exist or you don't have access yet. Join first to view a private challenge's leaderboard."
          action={{
            label: "Back to Challenges",
            onClick: () => navigate("/app/challenges"),
          }}
        />
      </div>
    );
  }

  const myEntry = data.leaderboard.find((e) => e.isMe);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* ── Back + header ── */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/app/challenges")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={15} />
          All Challenges
        </button>

        <div className="card p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
              <Trophy size={22} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white leading-snug">
                {data.challengeTitle}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Target size={12} />
                  {data.targetDays} days
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {data.totalParticipants} participants
                </span>
              </div>
            </div>
          </div>

          {/* My position summary */}
          {myEntry && (
            <div className="flex items-center gap-3 bg-brand-600/10 border border-brand-600/20 rounded-xl px-4 py-3">
              <div className="flex-shrink-0">
                <RankIcon rank={myEntry.rank} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  You're ranked{" "}
                  <span className="font-bold text-brand-400">
                    #{myEntry.rank}
                  </span>{" "}
                  with{" "}
                  <span className="font-semibold text-white">
                    {myEntry.completionsCount}/{data.targetDays}
                  </span>{" "}
                  days completed
                </p>
              </div>
              {myEntry.isCompleted && (
                <Badge variant="success" size="sm">
                  Finished 🎉
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Leaderboard list ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">
          Rankings
        </h2>

        {data.leaderboard.length === 0 ? (
          <EmptyState
            icon={<Users size={36} />}
            title="No participants yet"
            description="Be the first to join this challenge!"
          />
        ) : (
          <div className="space-y-2">
            {data.leaderboard.map((entry) => (
              <LeaderboardRow
                key={entry.rank}
                rank={entry.rank}
                name={entry.name}
                completionsCount={entry.completionsCount}
                progressPct={entry.progressPct}
                targetDays={data.targetDays}
                isCompleted={entry.isCompleted}
                completedAt={entry.completedAt}
                isMe={entry.isMe}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer nav ── */}
      <div className="flex justify-center pt-2">
        <Button variant="ghost" onClick={() => navigate("/app/challenges")}>
          <ArrowLeft size={15} className="mr-1.5" />
          Back to Challenges
        </Button>
      </div>
    </div>
  );
}
