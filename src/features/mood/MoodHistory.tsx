import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { MoodLogForm } from "./MoodLogForm";
import { useGetMoodsQuery, useDeleteMoodMutation } from "@/services/moodApi";
import { moodEmojis, moodToText, moodToLabel } from "@/utils/moodColor";
import { parseError } from "@/utils/errorParser";
import type { MoodEntry } from "@/types/mood.types";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";

export function MoodHistory() {
  const [page, setPage] = useState(1);
  const [editEntry, setEditEntry] = useState<MoodEntry | null>(null);

  const { data, isLoading } = useGetMoodsQuery({ page, limit: 10 });
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [deleteMood] = useDeleteMoodMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this mood entry?")) return;
    try {
      await deleteMood(id).unwrap();
      toast.success("Entry deleted");
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <EmptyState
        icon="😶"
        title="No mood entries yet"
        description="Start tracking how you feel each day."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.data.map((entry) => (
        <div
          key={entry.id}
          className="card p-4 flex items-start gap-3 hover:border-gray-700 transition-colors"
        >
          {/* Emoji + Score */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-2xl">
              {entry.emoji || moodEmojis[entry.moodScore]}
            </span>
            <span
              className={`text-xs font-bold ${moodToText(entry.moodScore)}`}
            >
              {entry.moodScore}/5
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-sm font-medium ${moodToText(entry.moodScore)}`}
              >
                {moodToLabel(entry.moodScore)}
              </span>
              <span className="text-xs text-gray-600">
                {format(parseISO(entry.createdAt), "MMM d, yyyy · h:mm a")}
              </span>
            </div>

            {entry.journal?.text && (
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                {entry.journal.text}
              </p>
            )}

            {entry.journal?.tags && entry.journal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.journal.tags.map((tag) => (
                  <Badge key={tag} variant="purple" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setEditEntry(entry)}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => handleDelete(entry.id)}
              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Page {page} of {data.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      <Modal
        isOpen={!!editEntry}
        onClose={() => setEditEntry(null)}
        title="Edit Mood Entry"
        size="md"
      >
        <MoodLogForm onSuccess={() => setEditEntry(null)} />
      </Modal>
      {data?.planLimitApplied && (
        <div className="card p-4 border-brand-500/30 bg-brand-500/5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-400">
              📅 Showing last 30 days only
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Upgrade to Pro to access your full mood history.
            </p>
          </div>
          <Button size="sm" onClick={() => navigate("/app/billing")}>
            Upgrade to Pro
          </Button>
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="card p-4 flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
