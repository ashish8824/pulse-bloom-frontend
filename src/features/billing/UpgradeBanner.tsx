import { Link } from "react-router-dom";
import { Zap, X } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

interface UpgradeBannerProps {
  message?: string;
  compact?: boolean;
  dismissible?: boolean;
  className?: string;
}

export function UpgradeBanner({
  message = "Upgrade to Pro to unlock this feature.",
  compact = false,
  dismissible = false,
  className,
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div
        className={clsx(
          "flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl",
          "bg-brand-600/10 border border-brand-500/25",
          className,
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <p className="text-xs text-gray-300 truncate">{message}</p>
        </div>
        <Link
          to="/app/billing"
          className="shrink-0 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          Upgrade →
        </Link>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 px-5 py-4 rounded-2xl",
        "bg-gradient-to-r from-brand-600/15 to-brand-500/5 border border-brand-500/25",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600/25 border border-brand-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Upgrade to Pro</p>
          <p className="text-xs text-gray-400 mt-0.5">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/app/billing"
          className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
        >
          Upgrade
        </Link>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
