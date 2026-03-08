import { useState, useCallback } from "react";
import {
  Users,
  ThumbsUp,
  Trophy,
  BookOpen,
  Plus,
  ShieldCheck,
  Clock,
  Flame,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { formatRelative } from "../../utils/formatDate";
import {
  useGetCommunityFeedQuery,
  useToggleUpvoteMutation,
} from "../../services/communityApi";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import CreatePostModal from "./CreatePostModal";
import { parseError } from "../../utils/errorParser";
import toast from "react-hot-toast";
import type { CommunityPost, PostType } from "../../types/community.types";

// ── Post card ─────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: CommunityPost;
  onUpvote: (id: string) => void;
  upvoting: boolean;
}

function PostCard({ post, onUpvote, upvoting }: PostCardProps) {
  const isMilestone = post.type === "MILESTONE";

  return (
    <div
      className={clsx(
        "card p-5 flex flex-col gap-4 transition-colors hover:border-gray-700",
        isMilestone
          ? "border-l-2 border-l-yellow-600/60"
          : "border-l-2 border-l-blue-600/60",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={clsx(
              "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
              isMilestone
                ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400",
            )}
          >
            {isMilestone ? <Trophy size={11} /> : <BookOpen size={11} />}
            {isMilestone ? "Milestone" : "Reflection"}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Clock size={10} />
            {formatRelative(post.createdAt)}
          </span>
        </div>

        {/* Upvote button */}
        <button
          onClick={() => onUpvote(post.id)}
          disabled={upvoting}
          className={clsx(
            "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all flex-shrink-0",
            post.hasUpvoted
              ? "bg-brand-600/20 border-brand-600/40 text-brand-400 font-semibold"
              : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600",
            upvoting && "opacity-50 cursor-not-allowed",
          )}
        >
          <ThumbsUp
            size={12}
            className={post.hasUpvoted ? "fill-brand-400" : ""}
          />
          <span className="tabular-nums">{post.upvotes}</span>
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800/60 border border-gray-700/50 px-2 py-0.5 rounded-lg"
            >
              <Tag size={9} />#{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all",
        active
          ? "bg-brand-600 border-brand-600 text-white"
          : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600",
      )}
    >
      {children}
    </button>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-gray-400 tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CommunityFeedPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [typeFilter, setTypeFilter] = useState<PostType | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetCommunityFeedQuery({
    sort,
    type: typeFilter,
    page,
    limit: 20,
  });

  const [toggleUpvote] = useToggleUpvoteMutation();

  const posts = data?.posts ?? [];
  const pagination = data?.pagination;

  const handleUpvote = useCallback(
    async (id: string) => {
      setUpvotingId(id);
      try {
        await toggleUpvote(id).unwrap();
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setUpvotingId(null);
      }
    },
    [toggleUpvote],
  );

  const handleSortChange = (s: "newest" | "popular") => {
    setSort(s);
    setPage(1);
  };

  const handleTypeChange = (t: PostType | undefined) => {
    setTypeFilter(t);
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-600/30">
            <Users size={22} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <p className="text-sm text-gray-400">
              Anonymous milestones &amp; reflections
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={15} />
          Share
        </Button>
      </div>

      {/* ── Anonymity notice ── */}
      <div className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-2.5">
        <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
        <p className="text-xs text-emerald-400/80">
          All posts are fully anonymous — no identity is stored or exposed.
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <FilterPill
            active={sort === "newest"}
            onClick={() => handleSortChange("newest")}
          >
            <Clock size={11} /> Newest
          </FilterPill>
          <FilterPill
            active={sort === "popular"}
            onClick={() => handleSortChange("popular")}
          >
            <Flame size={11} /> Popular
          </FilterPill>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-700 mx-1" />

        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          <FilterPill
            active={typeFilter === undefined}
            onClick={() => handleTypeChange(undefined)}
          >
            All
          </FilterPill>
          <FilterPill
            active={typeFilter === "MILESTONE"}
            onClick={() => handleTypeChange("MILESTONE")}
          >
            <Trophy size={11} /> Milestones
          </FilterPill>
          <FilterPill
            active={typeFilter === "REFLECTION"}
            onClick={() => handleTypeChange("REFLECTION")}
          >
            <BookOpen size={11} /> Reflections
          </FilterPill>
        </div>

        {/* Live count */}
        {pagination && (
          <span className="ml-auto text-xs text-gray-600 tabular-nums">
            {pagination.total} post{pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Feed ── */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="Nothing here yet"
          description="Be the first to share a milestone or reflection with the community."
          action={{
            label: "Share Something",
            onClick: () => setShowCreate(true),
          }}
        />
      ) : (
        <div
          className={clsx(
            "space-y-3",
            isFetching && "opacity-60 pointer-events-none",
          )}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              upvoting={upvotingId === post.id}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPage={setPage}
        />
      )}

      {/* ── Create modal ── */}
      <CreatePostModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
