"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | "ellipsis")[] = [1];
  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  if (rangeStart > 2) {
    result.push("ellipsis");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    result.push(i);
  }

  if (rangeEnd < total - 1) {
    result.push("ellipsis");
  }

  result.push(total);
  return result;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1 border-[#27156F]/15 px-3"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1 px-1">
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex size-9 items-center justify-center text-gray-400"
              aria-hidden
            >
              <MoreHorizontal className="size-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className={cn(
                "size-9 tabular-nums",
                page === currentPage
                  ? "bg-[#27156F] hover:bg-[#27156F]/90"
                  : "border-[#27156F]/15"
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1 border-[#27156F]/15 px-3"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
};
