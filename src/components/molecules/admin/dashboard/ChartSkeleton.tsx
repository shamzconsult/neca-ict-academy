import React from "react";

export const ChartSkeleton = () => (
  <div className="flex h-full w-full flex-col gap-4">
    <div className="flex gap-3">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
    </div>
    <div className="flex flex-1 items-end gap-2 px-2 pb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t-md bg-gray-100"
          style={{ height: `${30 + ((i * 17) % 50)}%` }}
        />
      ))}
    </div>
  </div>
);
