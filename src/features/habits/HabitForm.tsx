import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import toast from "react-hot-toast";
import { parseError } from "@/utils/errorParser";
import {
  useCreateHabitMutation,
  useUpdateHabitMutation,
} from "@/services/habitApi";
import type { Habit } from "@/types/habit.types";
import type { CreateHabitRequest } from "../../types/habit.types";

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
  const isLoading = creating || updating;

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
      const payload: CreateHabitRequest = {
        title: data.title,
        frequency: data.frequency,
        category: data.category,
        ...(data.description ? { description: data.description } : {}),
        ...(data.color ? { color: data.color } : {}),
        ...(data.icon ? { icon: data.icon } : {}),
        ...(data.frequency === "weekly" && data.targetPerWeek
          ? { targetPerWeek: data.targetPerWeek }
          : {}),
        reminderOn: data.reminderOn,
        ...(data.reminderOn && data.reminderTime
          ? { reminderTime: data.reminderTime }
          : {}),
      };

      if (editingHabit) {
        await updateHabit({ id: editingHabit.id, body: payload }).unwrap();
      } else {
        await createHabit(payload).unwrap();
      }
      try {
        if (editingHabit) {
          await updateHabit({ id: editingHabit.id, body: payload }).unwrap();
          toast.success("Habit updated!");
        } else {
          await createHabit(payload).unwrap();
          toast.success("Habit created!");
        }
        onClose();
        reset();
      } catch (e: any) {
        toast.error(parseError(e));
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
      <form id="habit-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Scrollable fields area */}
        <div className="max-h-[55vh] overflow-y-auto space-y-4 pr-1">
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
            <div className="flex gap-3">
              {(["daily", "weekly"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all
                    ${
                      frequency === f
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  onClick={() => setValue("frequency", f)}
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
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              {...register("category")}
            >
              {[
                "health",
                "fitness",
                "learning",
                "mindfulness",
                "productivity",
                "custom",
              ].map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-9 h-9 rounded-lg text-lg transition-all
                    ${
                      selectedIcon === icon
                        ? "bg-brand-600 ring-2 ring-brand-400"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  onClick={() => setValue("icon", icon)}
                >
                  {icon}
                </button>
              ))}
              <Input
                placeholder="Custom"
                className="w-20"
                {...register("icon")}
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all
                    ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white scale-110"
                        : ""
                    }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue("color", color)}
                />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminderOn"
              className="accent-brand-500"
              {...register("reminderOn")}
            />
            <label htmlFor="reminderOn" className="text-sm text-gray-300">
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
        {/* End scrollable area */}

        {/* Sticky footer — always visible, never cut off */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-800">
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
