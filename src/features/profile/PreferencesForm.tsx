import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Bell, Mail, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useUpdatePreferencesMutation } from "@/services/authApi";
import { updateUserPreferences } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/Button";
import { parseError } from "@/utils/errorParser";

interface PrefsForm {
  moodReminderOn: boolean;
  moodReminderTime: string;
  weeklyDigestOn: boolean;
}

export function PreferencesForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const prefs = user?.preferences;

  const [updatePreferences, { isLoading }] = useUpdatePreferencesMutation();

  const { register, handleSubmit, watch, reset } = useForm<PrefsForm>({
    defaultValues: {
      moodReminderOn: prefs?.moodReminderOn ?? false,
      moodReminderTime: prefs?.moodReminderTime ?? "20:00",
      weeklyDigestOn: prefs?.weeklyDigestOn ?? true,
    },
  });

  // Sync form if Redux user updates (e.g. after refresh)
  useEffect(() => {
    reset({
      moodReminderOn: prefs?.moodReminderOn ?? false,
      moodReminderTime: prefs?.moodReminderTime ?? "20:00",
      weeklyDigestOn: prefs?.weeklyDigestOn ?? true,
    });
  }, [prefs, reset]);

  const moodReminderOn = watch("moodReminderOn");

  const onSubmit = async (data: PrefsForm) => {
    try {
      await updatePreferences({
        moodReminderOn: data.moodReminderOn,
        moodReminderTime: data.moodReminderOn
          ? data.moodReminderTime
          : undefined,
        weeklyDigestOn: data.weeklyDigestOn,
      }).unwrap();
      dispatch(updateUserPreferences(data));
      toast.success("Preferences saved!");
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-5">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
        <Bell size={16} className="text-brand-400" />
        Notifications &amp; Reminders
      </h2>

      {/* Mood reminder toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Bell size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-200">
              Daily Mood Reminder
            </p>
            <p className="text-xs text-gray-500">
              Get a push notification to log your mood each day
            </p>
          </div>
        </div>
        <label className="relative flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            {...register("moodReminderOn")}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              moodReminderOn ? "bg-brand-600" : "bg-gray-700"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                moodReminderOn ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      {/* Reminder time — shown only when toggle is on */}
      {moodReminderOn && (
        <div className="flex items-center gap-3 pl-7">
          <Clock size={14} className="text-gray-500 flex-shrink-0" />
          <div className="flex items-center gap-3 flex-1">
            <label className="text-xs text-gray-400 whitespace-nowrap">
              Remind me at
            </label>
            <input
              type="time"
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              {...register("moodReminderTime")}
            />
          </div>
        </div>
      )}

      <div className="border-t border-gray-800" />

      {/* Weekly digest toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-200">
              Weekly Digest Email
            </p>
            <p className="text-xs text-gray-500">
              Receive a weekly summary of your mood trends and habit streaks
            </p>
          </div>
        </div>
        <label className="relative flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            {...register("weeklyDigestOn")}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              watch("weeklyDigestOn") ? "bg-brand-600" : "bg-gray-700"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                watch("weeklyDigestOn") ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" variant="primary" size="sm" loading={isLoading}>
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
