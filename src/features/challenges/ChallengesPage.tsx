import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Swords, Search, Key } from "lucide-react";
import {
  useGetChallengesQuery,
  useGetMyChallengesQuery,
  useGetJoinedChallengesQuery,
  useCreateChallengeMutation,
  useJoinChallengeMutation,
  useCompleteChallengeDayMutation,
} from "../../services/challengeApi";
import { useGetHabitsQuery } from "../../services/habitApi";
import { Tabs } from "../../components/ui/Tabs";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { BrowseCard, MyCard, JoinedCard } from "./ChallengeCard";
import { parseError } from "../../utils/errorParser";

// ── Zod schema ────────────────────────────────────────────────────────────────

const createSchema = z.object({
  title: z.string().min(3, "Min 3 characters").max(100, "Max 100 characters"),
  description: z.string().max(500).optional(),
  habitId: z.string().optional(),
  targetDays: z.coerce
    .number()
    .int()
    .min(1, "Min 1 day")
    .max(365, "Max 365 days"),
  startDate: z.string().min(1, "Start date required"),
  isPublic: z.boolean(),
});

type CreateForm = z.infer<typeof createSchema>;

// ── Join via code modal ───────────────────────────────────────────────────────

interface JoinCodeModalProps {
  open: boolean;
  onClose: () => void;
}

function JoinCodeModal({ open, onClose }: JoinCodeModalProps) {
  const [code, setCode] = useState("");
  const [joinChallenge, { isLoading }] = useJoinChallengeMutation();

  const handle = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter a join code");
      return;
    }
    try {
      const result = await joinChallenge({
        id: "placeholder",
        joinCode: trimmed,
      }).unwrap();
      toast.success(result.message ?? "Joined challenge!");
      onClose();
      setCode("");
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Join via Code" size="sm">
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-400">
          Enter the 8-character code shared with you to join a private
          challenge.
        </p>
        <Input
          label="Join Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. A3F9E201"
          maxLength={8}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={isLoading} onClick={handle}>
            Join
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Create challenge modal ────────────────────────────────────────────────────

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
}

function CreateModal({ open, onClose }: CreateModalProps) {
  const [createChallenge, { isLoading }] = useCreateChallengeMutation();
  const { data: habitsData } = useGetHabitsQuery();

  // Support both { habits: [] } and bare array shapes
  const habits = Array.isArray(habitsData)
    ? habitsData
    : ((habitsData as any)?.habits ?? []);

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      isPublic: true,
      targetDays: 30,
      startDate: todayStr,
      description: "",
      habitId: "",
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = async (data: CreateForm) => {
    try {
      await createChallenge({
        title: data.title,
        description: data.description || undefined,
        habitId: data.habitId || undefined,
        targetDays: Number(data.targetDays),
        startDate: data.startDate,
        isPublic: data.isPublic,
      }).unwrap();
      toast.success("Challenge created!");
      reset();
      onClose();
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  // Debug: log validation errors so we can see why submit might silently fail
  const onError = (errs: typeof errors) => {
    console.error("[CreateChallenge] Validation errors:", errs);
    const firstMsg = Object.values(errs)[0]?.message;
    if (firstMsg) toast.error(firstMsg);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Create Challenge" size="md">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Title */}
          <Input
            label="Title"
            placeholder="30 Days of Morning Meditation"
            error={errors.title?.message}
            {...register("title")}
          />

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              Description{" "}
              <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="What's this challenge about?"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              {...register("description")}
            />
          </div>

          {/* Target days + Start date */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Days"
              type="number"
              min={1}
              max={365}
              error={errors.targetDays?.message}
              {...register("targetDays", { valueAsNumber: true })}
            />
            <Input
              label="Start Date"
              type="date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
          </div>

          {/* Linked habit */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              Link to Habit{" "}
              <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <select
              {...register("habitId")}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">None — free-form challenge</option>
              {habits.map((h: any) => (
                <option key={h.id} value={h.id}>
                  {h.icon ? `${h.icon} ` : ""}
                  {h.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600">
              Habit-linked: progress advances automatically when you complete
              the habit.
            </p>
          </div>

          {/* Visibility toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("isPublic", true)}
                className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all ${
                  isPublic
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                    : "bg-gray-800/50 border-gray-700 text-gray-500 hover:border-gray-600"
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span>🌐</span> Public
                </span>
                <span className="text-xs opacity-70">
                  Anyone can find &amp; join
                </span>
              </button>
              <button
                type="button"
                onClick={() => setValue("isPublic", false)}
                className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all ${
                  !isPublic
                    ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-400"
                    : "bg-gray-800/50 border-gray-700 text-gray-500 hover:border-gray-600"
                }`}
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span>🔒</span> Private
                </span>
                <span className="text-xs opacity-70">Invite-only via code</span>
              </button>
            </div>
          </div>

          {/* Inline validation summary */}
          {Object.keys(errors).length > 0 && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 space-y-0.5">
              {Object.entries(errors).map(([field, err]) => (
                <p key={field}>
                  • {(err as any)?.message ?? `${field} is invalid`}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-4 py-3 flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isLoading}>
            Create Challenge
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "browse", label: "Browse" },
  { id: "joined", label: "My Progress" },
  { id: "mine", label: "Created by Me" },
];

export default function ChallengesPage() {
  const [tab, setTab] = useState("browse");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [search, setSearch] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const { data: browseData, isLoading: browseLoading } = useGetChallengesQuery({
    active: activeFilter,
  });

  const { data: joinedData, isLoading: joinedLoading } =
    useGetJoinedChallengesQuery();

  const { data: mineData, isLoading: mineLoading } = useGetMyChallengesQuery();

  const [joinChallenge] = useJoinChallengeMutation();
  const [completeChallengeDay] = useCompleteChallengeDayMutation();

  const joinedIds = new Set(joinedData?.challenges.map((c) => c.id) ?? []);

  const browseChallenges = (browseData?.challenges ?? []).filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      const result = await joinChallenge({ id }).unwrap();
      toast.success(result.message ?? "Joined!");
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setJoiningId(null);
    }
  };

  const handleCompleteDay = async (id: string) => {
    setCompletingId(id);
    try {
      const result = await completeChallengeDay({ id }).unwrap();
      if (result.alreadyCompleted) {
        toast("You've already completed this challenge! 🎉");
      } else {
        toast.success(
          result.isCompleted
            ? "Challenge complete! 🏆"
            : `Day marked! ${result.completionsCount}/${result.targetDays} days done.`,
        );
      }
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-600/30">
            <Swords size={22} className="text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Challenges</h1>
            <p className="text-sm text-gray-400">
              Compete, commit, and track your goals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowJoinCode(true)}
          >
            <Key size={15} className="mr-1.5" />
            Join via Code
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={15} className="mr-1" />
            New Challenge
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {/* Browse tab */}
      {tab === "browse" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search challenges…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex rounded-xl border border-gray-700 overflow-hidden text-xs font-medium">
              {(
                [
                  { label: "All", val: undefined },
                  { label: "Active", val: true },
                  { label: "Ended", val: false },
                ] as const
              ).map(({ label, val }) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(val as boolean | undefined)}
                  className={`px-3 py-2 transition-colors ${
                    activeFilter === val
                      ? "bg-brand-600 text-white"
                      : "bg-gray-800/50 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {browseLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : browseChallenges.length === 0 ? (
            <EmptyState
              icon={<Swords size={36} />}
              title="No challenges found"
              description="Be the first to create one!"
              action={{
                label: "Create Challenge",
                onClick: () => setShowCreate(true),
              }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {browseChallenges.map((c) => (
                <BrowseCard
                  key={c.id}
                  challenge={c}
                  isJoined={joinedIds.has(c.id)}
                  onJoin={handleJoin}
                  joining={joiningId === c.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Progress tab */}
      {tab === "joined" && (
        <div className="space-y-4">
          {joinedLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !joinedData?.challenges.length ? (
            <EmptyState
              icon={<Swords size={36} />}
              title="No challenges joined yet"
              description="Browse public challenges or join one via a code."
              action={{
                label: "Browse Challenges",
                onClick: () => setTab("browse"),
              }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {joinedData.challenges.map((c) => (
                <JoinedCard
                  key={c.id}
                  challenge={c}
                  onCompleteDay={handleCompleteDay}
                  completing={completingId === c.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Created by Me tab */}
      {tab === "mine" && (
        <div className="space-y-4">
          {mineLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !mineData?.challenges.length ? (
            <EmptyState
              icon={<Swords size={36} />}
              title="You haven't created any challenges"
              description="Create your first challenge and invite others to join."
              action={{
                label: "Create Challenge",
                onClick: () => setShowCreate(true),
              }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {mineData.challenges.map((c) => (
                <MyCard key={c.id} challenge={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} />
      <JoinCodeModal
        open={showJoinCode}
        onClose={() => setShowJoinCode(false)}
      />
    </div>
  );
}
