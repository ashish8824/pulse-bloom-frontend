import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/services/authApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { parseError } from "@/utils/errorParser";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] =
    useResendVerificationMutation();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }
    try {
      const result = await verifyEmail({ email, otp: code }).unwrap();
      dispatch(setCredentials(result));
      toast.success("Email verified! Welcome to PulseBloom 🌸");
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(parseError(err));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      toast.success("New OTP sent to your email");
      setCooldown(60);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-100">Verify your email</h2>
        <p className="text-sm text-gray-500">
          We sent a 6-digit code to{" "}
          <span className="text-gray-300 font-medium">
            {email || "your email"}
          </span>
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex gap-3 justify-center" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-lg font-bold bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        ))}
      </div>

      <Button fullWidth loading={isLoading} onClick={handleVerify}>
        Verify email
      </Button>

      <div className="text-center">
        {cooldown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in{" "}
            <span className="text-brand-400 font-medium">{cooldown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Didn't receive it? Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
}
