// src/features/habits/HabitLogHistory.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetHabitLogsQuery } from "@/services/habitApi";
import { formatDateTime } from "@/utils/formatDate";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface HabitLogHistoryProps {
  habitId: string;
}

export default function HabitLogHistory({ habitId }: HabitLogHistoryProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetHabitLogsQuery({
    id: habitId,
    page,
    limit,
  });

  if (isLoading) return <CardSkeleton />;

  // Backend returns: { logs, total, page, limit, totalPages }
  const logs = data?.logs ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-4">
        Completion Log
      </h3>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">No completions logged yet.</p>
      ) : (
        <>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div>
                  {/* Backend log shape: { id, date, note, completed } */}
                  <p className="text-sm text-gray-300">
                    {formatDateTime(log.date)}
                  </p>
                  {log.note && (
                    <p className="text-xs text-gray-500 mt-0.5">{log.note}</p>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  ✓ Done
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
