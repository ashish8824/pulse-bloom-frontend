// src/features/habits/HabitCalendar.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isFuture,
  isToday,
} from "date-fns";
import { useGetHabitMonthlySummaryQuery } from "@/services/habitApi";
import { toMonthParam } from "@/utils/formatDate";
import { CardSkeleton } from "@/components/ui/Skeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HabitCalendar({ habitId }: { habitId: string }) {
  const [current, setCurrent] = useState(new Date());
  const monthParam = toMonthParam(current);
  const { data, isLoading } = useGetHabitMonthlySummaryQuery({
    id: habitId,
    month: monthParam,
  });

  const completedDates = new Set(
    (data?.calendar ?? []).filter((d) => d.completed).map((d) => d.date),
  );

  const days = eachDayOfInterval({
    start: startOfMonth(current),
    end: endOfMonth(current),
  });
  const startOffset = getDay(startOfMonth(current));

  if (isLoading) return <CardSkeleton />;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-200">
          {format(current, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
            onClick={() =>
              setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1))
            }
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
            onClick={() =>
              setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1))
            }
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-xs text-gray-500 py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const completed = completedDates.has(key);
          const future = isFuture(day) && !isToday(day);
          return (
            <div
              key={key}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                ${
                  future
                    ? "text-gray-700"
                    : completed
                      ? "bg-emerald-600 text-white"
                      : isToday(day)
                        ? "border border-brand-500 text-brand-300"
                        : "bg-gray-800 text-gray-500"
                }`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
