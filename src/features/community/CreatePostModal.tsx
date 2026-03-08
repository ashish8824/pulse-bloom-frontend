import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X, Tag, ShieldCheck, Trophy, BookOpen } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useCreateCommunityPostMutation } from "../../services/communityApi";
import { parseError } from "../../utils/errorParser";
import type { PostType } from "../../types/community.types";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  type: z.enum(["MILESTONE", "REFLECTION"]),
  content: z
    .string()
    .min(10, "At least 10 characters")
    .max(500, "Max 500 characters"),
});

type FormData = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Tag input ─────────────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const slug = raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug || tags.includes(slug) || tags.length >= 5) return;
    onChange([...tags, slug]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Tags{" "}
        <span className="text-gray-600 font-normal">(optional · up to 5)</span>
      </label>
      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-brand-600/20 border border-brand-600/30 text-brand-300 text-xs px-2 py-1 rounded-lg"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-white transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        {tags.length < 5 && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(input);
              }
              if (e.key === "Backspace" && !input && tags.length > 0) {
                removeTag(tags[tags.length - 1]);
              }
            }}
            onBlur={() => input && addTag(input)}
            placeholder={
              tags.length === 0
                ? "meditation, streak, mindfulness…"
                : "Add tag…"
            }
            className="flex-1 min-w-[120px] bg-transparent text-xs text-gray-300 placeholder-gray-600 focus:outline-none"
          />
        )}
      </div>
      <div className="h-px bg-gray-800" />
      <p className="text-xs text-gray-600">
        Press Enter or comma to add · letters, numbers, hyphens only
      </p>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function CreatePostModal({
  open,
  onClose,
}: CreatePostModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [createPost, { isLoading }] = useCreateCommunityPostMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "MILESTONE", content: "" },
  });

  const type = watch("type");
  const content = watch("content");
  const remaining = 500 - (content?.length ?? 0);

  const handleClose = () => {
    reset();
    setTags([]);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createPost({
        type: data.type,
        content: data.content,
        tags: tags.length > 0 ? tags : undefined,
      }).unwrap();
      toast.success("Posted anonymously! 🌸");
      handleClose();
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const onError = (errs: typeof errors) => {
    const first = Object.values(errs)[0]?.message;
    if (first) toast.error(first);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Share with the Community"
      size="md"
    >
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col"
      >
        <div className="p-4 space-y-5">
          {/* Anonymity notice */}
          <div className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
            <ShieldCheck
              size={15}
              className="text-emerald-400 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Posts are fully anonymous — no name, email, or identity is ever
              stored.
            </p>
          </div>

          {/* Type selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Post type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    val: "MILESTONE" as PostType,
                    icon: Trophy,
                    label: "Milestone",
                    desc: "Achievement or streak",
                    color: "yellow",
                  },
                  {
                    val: "REFLECTION" as PostType,
                    icon: BookOpen,
                    label: "Reflection",
                    desc: "Thought or insight",
                    color: "blue",
                  },
                ] as const
              ).map(({ val, icon: Icon, label, desc, color }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValue("type", val)}
                  className={`flex items-start gap-2.5 px-3 py-3 rounded-xl border text-left transition-all ${
                    type === val
                      ? color === "yellow"
                        ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300"
                        : "bg-blue-500/10 border-blue-500/40 text-blue-300"
                      : "bg-gray-800/50 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs opacity-70">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                What do you want to share?
              </label>
              <span
                className={`text-xs tabular-nums ${
                  remaining < 50 ? "text-orange-400" : "text-gray-600"
                }`}
              >
                {remaining} left
              </span>
            </div>
            <textarea
              rows={4}
              placeholder={
                type === "MILESTONE"
                  ? "Just hit a 30-day meditation streak! Never thought I'd make it this far…"
                  : "Realized today that showing up consistently matters more than intensity…"
              }
              className={`w-full bg-gray-800 border rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-colors ${
                errors.content ? "border-red-500" : "border-gray-700"
              }`}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-red-400">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-3">
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-center justify-between gap-2">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Tag size={11} />
            Anonymous post
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={isLoading}>
              Post Anonymously
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
