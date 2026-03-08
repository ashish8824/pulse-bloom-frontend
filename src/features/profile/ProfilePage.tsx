import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { useChangePasswordMutation } from "@/services/authApi";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PreferencesForm } from "./PreferencesForm";
import { parseError } from "@/utils/errorParser";

// ── Password schema ───────────────────────────────────────────────────────────

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PwForm = z.infer<typeof pwSchema>;

// ── Plan meta ─────────────────────────────────────────────────────────────────

const PLAN_META = {
  free: { label: "Free", variant: "default" as const, color: "text-gray-400" },
  pro: { label: "Pro", variant: "purple" as const, color: "text-brand-400" },
  enterprise: {
    label: "Enterprise",
    variant: "info" as const,
    color: "text-blue-400",
  },
};

// ── Password field (self-contained with eye toggle) ───────────────────────────

interface PwFieldProps {
  label: string;
  hint?: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  registration: ReturnType<ReturnType<typeof useForm<PwForm>>["register"]>;
}

function PwField({
  label,
  hint,
  error,
  show,
  onToggle,
  registration,
}: PwFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={`w-full rounded-xl border bg-gray-900 px-4 py-2.5 pr-10 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-700 hover:border-gray-600"
          }`}
          {...registration}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ── Password section ──────────────────────────────────────────────────────────

function ChangePasswordSection() {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const toggle = (field: keyof typeof show) =>
    setShow((s) => ({ ...s, [field]: !s[field] }));

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PwForm>({ resolver: zodResolver(pwSchema) });

  const onSubmit = async (data: PwForm) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      toast.success("Password changed! Please log in again.");
      reset();
      setTimeout(() => dispatch(logout()), 1500);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const onError = (errs: typeof errors) => {
    const first = Object.values(errs)[0]?.message;
    if (first) toast.error(first);
  };

  return (
    <div className="card p-5 space-y-5">
      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
        <Shield size={16} className="text-brand-400" />
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3">
        <PwField
          label="Current Password"
          show={show.current}
          onToggle={() => toggle("current")}
          error={errors.currentPassword?.message}
          registration={register("currentPassword")}
        />
        <PwField
          label="New Password"
          hint="Min 8 chars · uppercase · lowercase · number · special char"
          show={show.next}
          onToggle={() => toggle("next")}
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />
        <PwField
          label="Confirm New Password"
          show={show.confirm}
          onToggle={() => toggle("confirm")}
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="primary" size="sm" loading={isLoading}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const plan = (user?.plan ?? "free") as keyof typeof PLAN_META;
  const meta = PLAN_META[plan];

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-600/30">
          <User size={22} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-sm text-gray-400">Your account and preferences</p>
        </div>
      </div>

      {/* ── Account info card ── */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <User size={16} className="text-brand-400" />
          Account
        </h2>

        {/* Avatar + name row */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-white truncate">
              {user?.name ?? "—"}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={meta.variant} size="sm">
                <Crown size={10} className="mr-1" />
                {meta.label}
              </Badge>
              {user?.isVerified && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800" />

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={15} className="text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-200">{user?.email ?? "—"}</p>
          </div>
        </div>

        {/* Plan */}
        <div className="flex items-center gap-3">
          <Crown size={15} className="text-gray-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Current Plan</p>
            <p className={`text-sm font-medium ${meta.color}`}>{meta.label}</p>
          </div>
          {plan === "free" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/app/billing")}
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* ── Preferences ── */}
      <PreferencesForm />

      {/* ── Change password ── */}
      <ChangePasswordSection />
    </div>
  );
}
