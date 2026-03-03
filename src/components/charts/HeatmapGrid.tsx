import { clsx } from "clsx";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatDate } from "@/utils/formatDate";
import { moodToBg } from "@/utils/moodColor";

interface HeatmapDay {
  date: string;
  value: number; // 0 = no data, 1-5 for mood, 0/1 for habits
  count?: number;
}

interface HeatmapGridProps {
  days: HeatmapDay[];
  mode?: "mood" | "habit";
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function habitBg(val: number) {
  return val === 1 ? "bg-brand-600" : "bg-gray-800";
}

export function HeatmapGrid({ days, mode = "mood" }: HeatmapGridProps) {
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

  return (
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
              <Tooltip
                key={day.date}
                content={
                  mode === "mood"
                    ? `${formatDate(day.date)}: ${day.value ? `Score ${day.value}` : "No entry"}`
                    : `${formatDate(day.date)}: ${day.value ? "Completed ✅" : "Missed"}`
                }
              >
                <div
                  className={clsx(
                    "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                    mode === "mood" ? moodToBg(day.value) : habitBg(day.value),
                  )}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
