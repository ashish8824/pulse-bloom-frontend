import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegisterMutation } from "@/services/authApi";
import { parseError } from "@/utils/errorParser";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[@$!%*?&]/, "Must contain a special character (@$!%*?&)"),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await register(data).unwrap();
      toast.success("Account created! Check your email for the OTP.");
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-100">Create account</h2>
        <p className="text-sm text-gray-500">
          Start your wellness journey today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Ashish Anand"
          autoComplete="name"
          error={errors.name?.message}
          {...field("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...field("email")}
        />

        {/* Password with show/hide */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`w-full rounded-xl border bg-gray-900 px-4 py-2.5 pr-11 text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              {...field("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Min 8 chars, uppercase, lowercase, number, special char
            </p>
          )}
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
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
