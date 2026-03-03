import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLoginMutation } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { parseError } from "@/utils/errorParser";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/app/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user.name}! 🌸`);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-100">Sign in</h2>
        <p className="text-sm text-gray-500">Welcome back to PulseBloom</p>
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

        {/* Password with show/hide toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full rounded-xl border bg-gray-900 px-4 py-2.5 pr-11 text-sm text-gray-100 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
