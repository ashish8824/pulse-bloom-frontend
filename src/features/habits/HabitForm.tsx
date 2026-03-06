// src/features/habits/HabitForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { parseError } from "@/utils/errorParser";
import {
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useUpdateReminderMutation,
} from "@/services/habitApi";
import type { Habit, CreateHabitRequest } from "@/types/habit.types";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekly"]),
  category: z.enum([
    "health",
    "fitness",
    "learning",
    "mindfulness",
    "productivity",
    "custom",
  ]),
  color: z.string().optional(),
  icon: z.string().optional(),
  targetPerWeek: z.coerce.number().min(1).max(7).optional(),
  reminderOn: z.boolean(),
  reminderTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PRESET_COLORS = [
  "#c44ef0",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];
const PRESET_ICONS = [
  "💪",
  "📚",
  "🧘",
  "🏃",
  "💧",
  "🌱",
  "✍️",
  "🎯",
  "😴",
  "🥗",
];
const CATEGORIES = [
  "health",
  "fitness",
  "learning",
  "mindfulness",
  "productivity",
  "custom",
];

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingHabit?: Habit | null;
}

export default function HabitForm({
  isOpen,
  onClose,
  editingHabit,
}: HabitFormProps) {
  const [createHabit, { isLoading: creating }] = useCreateHabitMutation();
  const [updateHabit, { isLoading: updating }] = useUpdateHabitMutation();
  const [updateReminder, { isLoading: updatingReminder }] =
    useUpdateReminderMutation();
  const isLoading = creating || updating || updatingReminder;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      frequency: "daily",
      category: "health",
      reminderOn: false,
    },
  });

  const frequency = watch("frequency");
  const reminderOn = watch("reminderOn");
  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  useEffect(() => {
    if (editingHabit) {
      reset({
        title: editingHabit.title,
        description: editingHabit.description,
        frequency: editingHabit.frequency,
        category: editingHabit.category,
        color: editingHabit.color,
        icon: editingHabit.icon,
        targetPerWeek: editingHabit.targetPerWeek,
        reminderOn: editingHabit.reminderOn,
        reminderTime: editingHabit.reminderTime,
      });
    } else {
      reset({ frequency: "daily", category: "health", reminderOn: false });
    }
  }, [editingHabit, reset]);

  async function onSubmit(data: FormData) {
    try {
      if (editingHabit) {
        // PATCH /:id — habit fields only (reminderOn/reminderTime are a SEPARATE endpoint)
        await updateHabit({
          id: editingHabit.id,
          body: {
            title: data.title,
            frequency: data.frequency,
            category: data.category,
            ...(data.description ? { description: data.description } : {}),
            ...(data.color ? { color: data.color } : {}),
            ...(data.icon ? { icon: data.icon } : {}),
            ...(data.frequency === "weekly" && data.targetPerWeek
              ? { targetPerWeek: data.targetPerWeek }
              : {}),
          },
        }).unwrap();

        // PATCH /:id/reminder — reminder fields only
        await updateReminder({
          id: editingHabit.id,
          body: {
            reminderOn: data.reminderOn,
            ...(data.reminderOn && data.reminderTime
              ? { reminderTime: data.reminderTime }
              : {}),
          },
        }).unwrap();

        toast.success("Habit updated!");
      } else {
        const payload: CreateHabitRequest = {
          title: data.title,
          frequency: data.frequency,
          category: data.category,
          reminderOn: data.reminderOn,
          ...(data.description ? { description: data.description } : {}),
          ...(data.color ? { color: data.color } : {}),
          ...(data.icon ? { icon: data.icon } : {}),
          ...(data.frequency === "weekly" && data.targetPerWeek
            ? { targetPerWeek: data.targetPerWeek }
            : {}),
          ...(data.reminderOn && data.reminderTime
            ? { reminderTime: data.reminderTime }
            : {}),
        };
        await createHabit(payload).unwrap();
        toast.success("Habit created!");
      }
      onClose();
      reset();
    } catch (e: any) {
      toast.error(parseError(e));
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingHabit ? "Edit Habit" : "Create Habit"}
      size="lg"
    >
      {/*
        The Modal body is already overflow-y-auto + flex-1.
        The form is just a normal stack. Footer is INSIDE the form
        but outside the modal body scroll — we pin it using a wrapper trick:
        the form renders fields then footer, modal body scrolls fields,
        footer sticks at visual bottom via sticky positioning.
      */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Fields ─────────────────────────────────────────── */}
        <div className="space-y-5">
          <Input
            label="Title"
            placeholder="e.g. Morning meditation"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="Description (optional)"
            placeholder="Why does this habit matter?"
            {...register("description")}
          />

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequency
            </label>
            <div className="flex gap-2">
              {(["daily", "weekly"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setValue("frequency", f)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${
                      frequency === f
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {frequency === "weekly" && (
            <Input
              label="Target per week"
              type="number"
              min={1}
              max={7}
              error={errors.targetPerWeek?.message}
              {...register("targetPerWeek")}
            />
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              {...register("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap items-center">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon)}
                  className={`w-9 h-9 rounded-lg text-lg transition-all
                    ${
                      selectedIcon === icon
                        ? "bg-brand-600 ring-2 ring-brand-400"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`w-8 h-8 rounded-full transition-all
                    ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white scale-110"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="reminderOn"
              className="w-4 h-4 accent-brand-500 cursor-pointer"
              {...register("reminderOn")}
            />
            <label
              htmlFor="reminderOn"
              className="text-sm text-gray-300 cursor-pointer"
            >
              Enable reminder
            </label>
          </div>

          {reminderOn && (
            <Input
              label="Reminder time"
              type="time"
              {...register("reminderTime")}
            />
          )}
        </div>

        {/* ── Footer — sticky so it stays visible at bottom of modal ── */}
        <div className="sticky bottom-0 bg-gray-900 flex justify-end gap-3 pt-4 mt-6 border-t border-gray-800 -mx-6 px-6 pb-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isLoading}>
            {editingHabit ? "Save Changes" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
