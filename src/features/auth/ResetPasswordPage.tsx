import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useResetPasswordMutation } from "@/services/authApi";
import { parseError } from "@/utils/errorParser";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    try {
      await resetPassword({ token, ...data }).unwrap();
      setDone(true);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="text-emerald-400" size={48} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-100">Password reset!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your password has been updated. All sessions have been signed out.
          </p>
        </div>
        <Button fullWidth onClick={() => navigate("/login", { replace: true })}>
          Sign in with new password
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400 text-sm">Invalid or expired reset link.</p>
        <Link
          to="/forgot-password"
          className="text-brand-400 text-sm hover:text-brand-300"
        >
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-100">New password</h2>
        <p className="text-sm text-gray-500">
          Choose a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Min 8 chars, uppercase, lowercase, number, special char"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" fullWidth loading={isLoading}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
