import { cn } from "@/lib/utils";
import type { HonorSummary } from "@/types";

export function HonorBadge({
  honor,
  className,
}: {
  honor: Pick<HonorSummary, "name" | "badgeColor">;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-snug text-white",
        className,
      )}
      style={{ backgroundColor: honor.badgeColor || "#27156F" }}
      title={honor.name}
    >
      <span className='truncate'>{honor.name}</span>
    </span>
  );
}

export function HonorBadgeList({
  honors,
  className,
  max = 3,
}: {
  honors?: HonorSummary[];
  className?: string;
  max?: number;
}) {
  if (!honors?.length) return null;

  const visible = honors.slice(0, max);
  const remaining = honors.length - visible.length;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((honor) => (
        <HonorBadge key={honor._id} honor={honor} />
      ))}
      {remaining > 0 && (
        <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600'>
          +{remaining} more
        </span>
      )}
    </div>
  );
}

/** Compact overlay for graduate cards: first honor + "+X" when multiple. */
export function HonorBadgeOverlay({
  honors,
  className,
}: {
  honors?: HonorSummary[];
  className?: string;
}) {
  if (!honors?.length) return null;

  const [primary, ...rest] = honors;
  const allTitles = honors.map((h) => h.name).join(", ");

  return (
    <div
      className={cn("flex max-w-[calc(100%-3.5rem)] items-center gap-1", className)}
      title={allTitles}
    >
      <HonorBadge
        honor={primary}
        className='max-w-[10rem] shadow-md ring-1 ring-black/10'
      />
      {rest.length > 0 && (
        <span className='inline-flex shrink-0 items-center rounded-full bg-[#27156F]/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-md ring-1 ring-black/10'>
          +{rest.length}
        </span>
      )}
    </div>
  );
}
