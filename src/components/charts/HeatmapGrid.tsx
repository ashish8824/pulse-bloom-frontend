import { clsx } from "clsx";
import { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { moodToBg } from "@/utils/moodColor";

interface HeatmapDay {
  date: string;
  value: number;
  count?: number;
}

interface HeatmapGridProps {
  days: HeatmapDay[];
  mode?: "mood" | "habit";
}

interface TooltipState {
  content: string;
  x: number;
  y: number;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function habitBg(val: number) {
  return val === 1 ? "bg-brand-600" : "bg-gray-800";
}

export function HeatmapGrid({ days, mode = "mood" }: HeatmapGridProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Group into weeks (columns)
  const weeks: HeatmapDay[][] = [];
  let week: HeatmapDay[] = [];

  days.forEach((day, i) => {
    week.push(day);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: HeatmapDay,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const content =
      mode === "mood"
        ? `${formatDate(day.date)}: ${day.value ? `Score ${day.value}` : "No entry"}`
        : `${formatDate(day.date)}: ${day.value ? "Completed ✅" : "Missed"}`;

    setTooltip({
      content,
      // Use viewport coords — the fixed tooltip will sit correctly
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <>
      {/* Fixed-position tooltip — renders outside any overflow container */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-gray-900 border border-gray-700 text-gray-100 text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
            {tooltip.content}
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700" />
          </div>
        </div>
      )}

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {/* Weekday labels */}
          <div className="flex flex-col gap-1 mr-1">
            {WEEKDAY_LABELS.map((d) => (
              <div
                key={d}
                className="h-3 w-6 text-[9px] text-gray-600 flex items-center"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {w.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={handleMouseLeave}
                  className={clsx(
                    "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                    mode === "mood" ? moodToBg(day.value) : habitBg(day.value),
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
