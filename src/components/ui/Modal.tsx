import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop — fixed so it stays put while overlay scrolls */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — my-10 gives breathing room top & bottom */}
      <div
        className={clsx(
          "relative w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl my-10 mx-4 sm:mx-auto",
          sizes[size],
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-base font-semibold text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
