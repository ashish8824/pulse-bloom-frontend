import { useState } from "react";
import { Bell } from "lucide-react";
import { clsx } from "clsx";
import { useGetUnreadCountQuery } from "@/services/notificationApi";
import { NotificationDrawer } from "./NotificationDrawer";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30_000, // poll every 30s
  });

  const unreadCount = data?.unreadCount ?? 0;
  const displayCount =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell size={18} />

        {/* Unread badge */}
        {displayCount && (
          <span
            className={clsx(
              "absolute flex items-center justify-center",
              "bg-brand-600 text-white font-bold rounded-full",
              "border-2 border-gray-900",
              "animate-pulse",
              displayCount.length > 1
                ? "-top-0.5 -right-1 min-w-[18px] h-[18px] text-[9px] px-1"
                : "-top-0.5 -right-0.5 w-4 h-4 text-[10px]",
            )}
          >
            {displayCount}
          </span>
        )}
      </button>

      <NotificationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
