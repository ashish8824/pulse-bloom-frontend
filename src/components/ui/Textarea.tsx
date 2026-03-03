import { type TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-gray-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 resize-none",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-700 hover:border-gray-600",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
