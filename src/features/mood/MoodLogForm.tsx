import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCreateMoodMutation } from "@/services/moodApi";
import { parseError } from "@/utils/errorParser";
import { moodEmojis } from "@/utils/moodColor";

const schema = z.object({
  moodScore: z.number().min(1).max(5),
  emoji: z.string().min(1),
  journalText: z.string().max(5000).optional(),
  tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

interface MoodLogFormProps {
  onSuccess?: () => void;
}

const SCORE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Very Low", color: "text-red-400" },
  2: { label: "Low", color: "text-orange-400" },
  3: { label: "Okay", color: "text-yellow-400" },
  4: { label: "Good", color: "text-emerald-400" },
  5: { label: "Excellent", color: "text-emerald-300" },
};

export function MoodLogForm({ onSuccess }: MoodLogFormProps) {
  const [createMood, { isLoading }] = useCreateMoodMutation();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { moodScore: 3, emoji: moodEmojis[3] },
  });

  const selectedScore = watch("moodScore");

  const handleScoreSelect = (score: number) => {
    setValue("moodScore", score);
    setValue("emoji", moodEmojis[score]);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      const next = [...tags, t];
      setTags(next);
      setValue("tags", next);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    setValue("tags", next);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createMood({ ...data, tags }).unwrap();
      toast.success("Mood logged! 🌸");
      onSuccess?.();
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Score selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-300">
          How are you feeling?
        </p>
        <div className="flex justify-between gap-2">
          {([1, 2, 3, 4, 5] as const).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => handleScoreSelect(score)}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-150",
                selectedScore === score
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-gray-700 hover:border-gray-600 bg-gray-800/50",
              )}
            >
              <span className="text-xl">{moodEmojis[score]}</span>
              <span className="text-xs text-gray-500 hidden sm:block">
                {SCORE_LABELS[score].label}
              </span>
            </button>
          ))}
        </div>
        {selectedScore && (
          <p
            className={`text-xs font-medium ${SCORE_LABELS[selectedScore].color}`}
          >
            {moodEmojis[selectedScore]} {SCORE_LABELS[selectedScore].label}
          </p>
        )}
        {errors.moodScore && (
          <p className="text-xs text-red-400">Please select a mood score</p>
        )}
      </div>

      {/* Journal */}
      <Textarea
        label="Journal (optional)"
        placeholder="What's on your mind? How was your day?"
        rows={4}
        error={errors.journalText?.message}
        {...register("journalText")}
      />

      {/* Tags */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-300">Tags (optional)</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="work, anxiety, sleep..."
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" fullWidth loading={isLoading}>
        Save mood entry
      </Button>
    </form>
  );
}
