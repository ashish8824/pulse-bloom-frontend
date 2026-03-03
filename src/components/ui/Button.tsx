import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500",
      secondary:
        "bg-gray-800 hover:bg-gray-700 text-gray-100 focus:ring-gray-600",
      ghost:
        "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-600",
      destructive: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500",
      outline:
        "border border-gray-700 hover:border-gray-500 bg-transparent text-gray-300 hover:text-white focus:ring-gray-600",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
