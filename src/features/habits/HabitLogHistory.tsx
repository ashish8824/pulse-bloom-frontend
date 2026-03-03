// src/features/habits/HabitLogHistory.tsx
import { useState } from "react";
import { useGetHabitLogsQuery } from "@/services/habitApi";
import { formatDateTime } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { CheckCircle } from "lucide-react";

export default function HabitLogHistory({ habitId }: { habitId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetHabitLogsQuery({
    id: habitId,
    page,
    limit: 10,
  });

  if (isLoading) return <CardSkeleton />;

  if (!data)
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-200 mb-4">
          Completion Log
        </h3>
        <p className="text-sm text-gray-500">No completions logged yet.</p>
      </div>
    );

  const logs = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-4">
        Completion Log
      </h3>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">No completions logged yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0"
            >
              <CheckCircle
                size={14}
                className="text-emerald-400 flex-shrink-0"
              />
              <span className="text-sm text-gray-300 flex-1">
                {formatDateTime(log.createdAt)}
              </span>
              {log.note && (
                <span className="text-xs text-gray-500 italic">
                  "{log.note}"
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
