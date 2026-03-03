import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { Badge } from "@/components/ui/Badge";

const pageTitles: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/mood": "Mood Tracker",
  "/app/mood/log": "Log Mood",
  "/app/mood/heatmap": "Mood Heatmap",
  "/app/mood/trends": "Mood Trends",
  "/app/mood/insights": "Daily Insights",
  "/app/mood/burnout": "Burnout Risk",
  "/app/habits": "Habits",
  "/app/habits/archived": "Archived Habits",
  "/app/ai": "AI Insights",
  "/app/billing": "Billing",
  "/app/profile": "Profile",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "PulseBloom";

  const planVariant = {
    free: "default" as const,
    pro: "purple" as const,
    enterprise: "info" as const,
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-semibold text-gray-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors">
          <Bell size={18} />
        </button>

        {user?.plan && (
          <Badge
            variant={planVariant[user.plan]}
            className="hidden sm:inline-flex"
          >
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          </Badge>
        )}

        {user?.name && (
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
