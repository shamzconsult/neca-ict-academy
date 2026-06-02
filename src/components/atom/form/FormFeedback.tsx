import { cn } from "@/lib/utils";
import { AlertCircle, X } from "lucide-react";

export function FormErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 text-red-600 hover:bg-red-100"
          aria-label="Dismiss error"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function FieldError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;

  return (
    <p className={cn("text-xs text-red-600 mt-1", className)} role="alert">
      {message}
    </p>
  );
}

export function fieldErrorClass(hasError: boolean) {
  return hasError ? "border-red-500 focus-visible:ring-red-500/30" : "";
}
