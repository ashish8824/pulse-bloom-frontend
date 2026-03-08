import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Lock,
  Globe,
  Target,
  Trophy,
  CheckCircle2,
  Copy,
  Check,
  Swords,
  Link2,
  Share2,
} from "lucide-react";
import { clsx } from "clsx";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import type { Challenge, JoinedChallenge } from "../../types/challenge.types";

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500",
          clamped === 100
            ? "bg-emerald-500"
            : "bg-gradient-to-r from-brand-600 to-brand-400",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ── Copy button (generic) ─────────────────────────────────────────────────────

function CopyButton({
  value,
  label,
  icon: Icon,
  successLabel = "Copied!",
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  successLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handle = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handle}
      className={clsx(
        "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all",
        copied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600",
      )}
    >
      {copied ? <Check size={12} /> : <Icon size={12} />}
      {copied ? successLabel : label}
    </button>
  );
}

// ── Browse card ───────────────────────────────────────────────────────────────

interface BrowseCardProps {
  challenge: Challenge;
  isJoined?: boolean;
  onJoin: (id: string) => void;
  joining?: boolean;
}

export function BrowseCard({
  challenge,
  isJoined,
  onJoin,
  joining,
}: BrowseCardProps) {
  const navigate = useNavigate();

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge
              variant={challenge.isActive ? "success" : "default"}
              size="sm"
            >
              {challenge.isActive ? "Active" : "Ended"}
            </Badge>
            <Badge variant={challenge.habitId ? "purple" : "info"} size="sm">
              {challenge.habitId ? "Habit-linked" : "Free-form"}
            </Badge>
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug truncate">
            {challenge.title}
          </h3>
          {challenge.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {challenge.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 p-2.5 rounded-xl bg-brand-600/10 border border-brand-600/20">
          <Swords size={18} className="text-brand-400" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Target size={12} /> {challenge.targetDays} days
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} /> {challenge.participantCount ?? 0} joined
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> {formatDate(challenge.startDate)}
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          {challenge.isPublic ? (
            <Globe size={12} className="text-emerald-500" />
          ) : (
            <Lock size={12} className="text-yellow-500" />
          )}
          {challenge.isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/app/challenges/${challenge.id}`)}
        >
          Leaderboard
        </Button>
        <div className="ml-auto">
          {isJoined ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 size={14} /> Joined
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              loading={joining}
              onClick={() => onJoin(challenge.id)}
              disabled={!challenge.isActive}
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── My (created) card ─────────────────────────────────────────────────────────

interface MyCardProps {
  challenge: Challenge;
}

export function MyCard({ challenge }: MyCardProps) {
  const navigate = useNavigate();

  // Build shareable link using current origin
  const shareUrl = challenge.joinCode
    ? `${window.location.origin}/join?code=${challenge.joinCode}`
    : null;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge
              variant={challenge.isActive ? "success" : "default"}
              size="sm"
            >
              {challenge.isActive ? "Active" : "Ended"}
            </Badge>
            {!challenge.isPublic && (
              <Badge variant="warning" size="sm">
                Private
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug">
            {challenge.title}
          </h3>
          {challenge.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {challenge.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <Trophy size={18} className="text-yellow-400" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Target size={12} /> {challenge.targetDays} days
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} /> {challenge.participantCount ?? 0} joined
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> ends {formatDate(challenge.endDate)}
        </span>
      </div>

      {/* Share section — shown for private challenges with a joinCode */}
      {challenge.joinCode && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Share2 size={13} className="text-yellow-500" />
            <span className="text-xs font-medium text-gray-300">
              Share this challenge
            </span>
          </div>

          {/* Code row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock size={11} className="text-gray-500" />
              <span className="text-xs text-gray-500">Code:</span>
              <span className="font-mono text-sm font-bold tracking-widest text-white">
                {challenge.joinCode}
              </span>
            </div>
            <CopyButton
              value={challenge.joinCode}
              label="Copy Code"
              icon={Copy}
              successLabel="Code Copied!"
            />
          </div>

          {/* Link row */}
          {shareUrl && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Link2 size={11} className="text-gray-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 truncate">
                  {shareUrl}
                </span>
              </div>
              <CopyButton
                value={shareUrl}
                label="Copy Link"
                icon={Link2}
                successLabel="Link Copied!"
              />
            </div>
          )}

          <p className="text-xs text-gray-600 pt-0.5">
            {challenge.isPublic
              ? "Public challenge — anyone can join via this code or link"
              : "Private challenge — only people with this code or link can join"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/app/challenges/${challenge.id}`)}
        >
          View Leaderboard
        </Button>
      </div>
    </div>
  );
}

// ── Joined (with progress) card ───────────────────────────────────────────────

interface JoinedCardProps {
  challenge: JoinedChallenge;
  onCompleteDay: (id: string) => void;
  completing?: boolean;
}

export function JoinedCard({
  challenge,
  onCompleteDay,
  completing,
}: JoinedCardProps) {
  const navigate = useNavigate();
  const { progress } = challenge;
  const isFreeForm = !challenge.habitId;

  return (
    <div
      className={clsx(
        "card p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors",
        progress.isCompleted && "border-emerald-800/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {progress.isCompleted ? (
              <Badge variant="success" size="sm">
                Completed 🎉
              </Badge>
            ) : (
              <Badge
                variant={challenge.isActive ? "info" : "default"}
                size="sm"
              >
                {challenge.isActive ? "In Progress" : "Ended"}
              </Badge>
            )}
            {isFreeForm && (
              <Badge variant="default" size="sm">
                Free-form
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug">
            {challenge.title}
          </h3>
        </div>
        <span className="text-lg font-bold text-brand-400 flex-shrink-0">
          {progress.progressPct}%
        </span>
      </div>

      <div className="space-y-1.5">
        <ProgressBar pct={progress.progressPct} />
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {progress.completionsCount} / {progress.targetDays} days
          </span>
          <span>ends {formatDate(challenge.endDate)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/app/challenges/${challenge.id}`)}
        >
          Leaderboard
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {isFreeForm && !progress.isCompleted && challenge.isActive && (
            <Button
              variant="primary"
              size="sm"
              loading={completing}
              onClick={() => onCompleteDay(challenge.id)}
            >
              ✓ Mark Today
            </Button>
          )}
          {!isFreeForm && (
            <span className="text-xs text-gray-600 italic">
              Auto-tracked via habit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
