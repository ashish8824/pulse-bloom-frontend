import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForgotPasswordMutation } from "@/services/authApi";
import { parseError } from "@/utils/errorParser";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="text-emerald-400" size={48} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-100">Check your email</h2>
          <p className="text-sm text-gray-500 mt-1">
            If <span className="text-gray-300">{getValues("email")}</span> is
            registered, a reset link has been sent.
          </p>
        </div>
        <p className="text-xs text-gray-600">The link expires in 1 hour.</p>
        <Link
          to="/login"
          className="block text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-100">Reset password</h2>
        <p className="text-sm text-gray-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" fullWidth loading={isLoading}>
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Remember it?{" "}
        <Link
          to="/login"
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
