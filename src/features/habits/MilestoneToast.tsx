// src/features/habits/MilestoneToast.tsx
import toast from "react-hot-toast";

interface Milestone {
  days: number;
  message: string;
}

const MILESTONE_EMOJIS: Record<number, string> = {
  7: "🔥",
  14: "⚡",
  21: "💪",
  30: "🏆",
  60: "🚀",
  90: "🌟",
  100: "💯",
  180: "🎯",
  365: "👑",
};

export function showMilestoneToast(milestone: Milestone) {
  const emoji = MILESTONE_EMOJIS[milestone.days] ?? "🎉";
  toast.custom(
    (t) => (
      <div
        className={`${t.visible ? "animate-enter" : "animate-leave"}
        bg-gradient-to-r from-brand-600 to-brand-800 text-white
        px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm`}
      >
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-bold text-sm">{milestone.days}-Day Streak!</p>
          <p className="text-xs text-brand-100">{milestone.message}</p>
        </div>
      </div>
    ),
    { duration: 5000 },
  );
}
