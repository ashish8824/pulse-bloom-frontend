import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  CheckCheck,
  Flame,
  Trophy,
  AlertTriangle,
  BarChart2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
} from "@/services/notificationApi";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/utils/formatDate";
import type {
  Notification,
  NotificationType,
} from "@/types/notification.types";

// ── Deep-link map ─────────────────────────────────────────────────

function getDeepLink(
  type: NotificationType,
  relatedId?: string | null,
): string {
  switch (type) {
    case "STREAK_MILESTONE":
      return relatedId ? `/app/habits/${relatedId}` : "/app/habits";
    case "BADGE_EARNED":
      return "/app/badges";
    case "CHALLENGE_UPDATE":
      return relatedId ? `/app/challenges/${relatedId}` : "/app/challenges";
    case "WEEKLY_SUMMARY":
      return "/app/dashboard";
    case "BURNOUT_RISK_CHANGED":
      return "/app/mood/burnout";
    case "MOOD_REMINDER":
      return "/app/mood";
    case "HABIT_REMINDER":
      return "/app/habits";
    default:
      return "/app/dashboard";
  }
}

// ── Icon map ──────────────────────────────────────────────────────

const typeIcon: Record<
  NotificationType,
  { Icon: React.ElementType; color: string; bg: string }
> = {
  STREAK_MILESTONE: {
    Icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  BADGE_EARNED: {
    Icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  CHALLENGE_UPDATE: {
    Icon: Sparkles,
    color: "text-brand-400",
    bg: "bg-brand-400/10",
  },
  WEEKLY_SUMMARY: {
    Icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  BURNOUT_RISK_CHANGED: {
    Icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  MOOD_REMINDER: {
    Icon: Calendar,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  HABIT_REMINDER: {
    Icon: Clock,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
};

// ── Single notification row ───────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (
    id: string,
    type: NotificationType,
    relatedId?: string | null,
  ) => void;
}) {
  const iconInfo = typeIcon[notification.type] ?? typeIcon.WEEKLY_SUMMARY;
  const { Icon } = iconInfo;

  return (
    <button
      onClick={() =>
        onRead(notification.id, notification.type, notification.relatedId)
      }
      className={clsx(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-800/60",
        !notification.isRead && "bg-brand-600/5",
      )}
    >
      {/* Icon */}
      <div
        className={clsx(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
          iconInfo.bg,
        )}
      >
        <Icon className={clsx("w-4 h-4", iconInfo.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "text-sm leading-snug",
            notification.isRead ? "text-gray-300" : "text-white font-medium",
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {formatRelative(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
      )}
    </button>
  );
}

// ── Main drawer ───────────────────────────────────────────────────

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
}: NotificationDrawerProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetNotificationsQuery(
    { page, limit: 20 },
    { skip: !isOpen },
  );
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  const notifications = data?.notifications ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen)
      setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  const handleRead = async (
    id: string,
    type: NotificationType,
    relatedId?: string | null,
  ) => {
    try {
      await markRead(id).unwrap();
    } catch {
      // ignore — still navigate
    }
    onClose();
    navigate(getDeepLink(type, relatedId));
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-400" />
            <h2 className="text-base font-semibold text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-0 divide-y divide-gray-800/60">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={<Bell className="w-8 h-8 text-gray-600" />}
                title="No notifications yet"
                description="Streak milestones, burnout alerts, and weekly summaries will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-800/40">
              {notifications.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onRead={handleRead}
                />
              ))}

              {/* Load more */}
              {page < totalPages && (
                <div className="p-4">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="w-full py-2 rounded-xl text-sm text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-800 border border-gray-700 transition-colors"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
