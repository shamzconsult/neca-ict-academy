"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormErrorBanner } from "@/components/atom/form/FormFeedback";
import { parseApiError } from "@/lib/parse-api-error";
import type { GraduationTitleType, HonorSummary } from "@/types";
import { HonorBadge } from "./HonorBadge";

type EnrollmentHonorsPanelProps = {
  enrollmentId: string;
  honors: HonorSummary[];
  isGraduated: boolean;
  queryKeysToInvalidate?: string[][];
  compact?: boolean;
};

export function EnrollmentHonorsPanel({
  enrollmentId,
  honors,
  isGraduated,
  queryKeysToInvalidate = [],
  compact = false,
}: EnrollmentHonorsPanelProps) {
  const queryClient = useQueryClient();
  const [selectedTitleId, setSelectedTitleId] = useState("");
  const [error, setError] = useState("");

  const { data: titlesData } = useQuery<{
    success: boolean;
    data: GraduationTitleType[];
  }>({
    queryKey: ["graduation-titles", "active"],
    queryFn: async () => {
      const res = await fetch("/api/graduation-titles?activeOnly=true");
      if (!res.ok) throw new Error("Failed to load titles");
      return res.json();
    },
    enabled: isGraduated,
  });

  const titles = titlesData?.data ?? [];
  const assignedTitleIds = new Set(honors.map((h) => h.titleId));
  const availableTitles = titles.filter((t) => !assignedTitleIds.has(t._id));

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollment-detail"] });
    queryClient.invalidateQueries({ queryKey: ["graduated-applicants"] });
    queryClient.invalidateQueries({ queryKey: ["cohort-applicants"] });
    for (const key of queryKeysToInvalidate) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  };

  const assignMutation = useMutation({
    mutationFn: async (titleId: string) => {
      const res = await fetch(`/api/enrollments/${enrollmentId}/honors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleId }),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to assign honor"));
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Graduation honor assigned");
      setSelectedTitleId("");
      setError("");
      invalidateAll();
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (honorId: string) => {
      const res = await fetch(
        `/api/enrollments/${enrollmentId}/honors/${honorId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to remove honor"));
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Graduation honor removed");
      invalidateAll();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (!isGraduated) {
    return (
      <p className='text-xs text-gray-500'>
        Graduation honors can be assigned after the student is marked as
        graduated.
      </p>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {honors.length > 0 ? (
        <ul className='space-y-2'>
          {honors.map((honor) => (
            <li
              key={honor._id}
              className='flex items-center justify-between gap-2 rounded-lg border border-[#27156F]/10 bg-white px-3 py-2'
            >
              <HonorBadge honor={honor} />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7 shrink-0 text-gray-400 hover:text-[#E02B20]'
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(honor._id)}
                aria-label={`Remove ${honor.name}`}
              >
                <X className='size-3.5' />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-xs text-gray-500'>
          No graduation honors assigned yet.
        </p>
      )}

      {error && (
        <FormErrorBanner message={error} onDismiss={() => setError("")} />
      )}

      {availableTitles.length > 0 ? (
        <div className='space-y-2'>
          <Label htmlFor={`assign-honor-${enrollmentId}`}>Assign honor</Label>
          <div className='flex gap-2'>
            <Select value={selectedTitleId} onValueChange={setSelectedTitleId}>
              <SelectTrigger
                id={`assign-honor-${enrollmentId}`}
                className='min-w-0 flex-1 bg-white'
              >
                <SelectValue placeholder='Select a title' />
              </SelectTrigger>
              <SelectContent>
                {availableTitles.map((title) => (
                  <SelectItem key={title._id} value={title._id}>
                    {title.name}
                    {title.maxWinners === 1
                      ? ` (1 per ${title.scope === "course" ? "course" : "cohort"})`
                      : title.maxWinners === 0
                        ? ""
                        : ` (max ${title.maxWinners})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type='button'
              className='shrink-0 gap-1 bg-[#27156F] text-white hover:bg-[#27156F]/90'
              disabled={!selectedTitleId || assignMutation.isPending}
              onClick={() => assignMutation.mutate(selectedTitleId)}
            >
              {assignMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <>
                  <Plus className='size-4' />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      ) : titles.length === 0 ? (
        <p className='text-xs text-gray-500'>
          Create graduation titles under Graduation Titles in the sidebar first.
        </p>
      ) : (
        <p className='text-xs text-gray-500'>
          All available titles are already assigned for this application.
        </p>
      )}
    </div>
  );
}
