"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnrollmentType } from "@/types";
import { levelOptions, statusOptions } from "@/const";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiError } from "@/lib/parse-api-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableStatusBadge } from "@/components/atom/Table/Table";
import { FormErrorBanner } from "@/components/atom/form/FormFeedback";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  enrollment: EnrollmentType | null;
  onNavigate: (direction: "next" | "prev") => void;
  /** Global position across all pages (1-based) */
  globalPosition?: number;
  /** Total applicants matching current filters */
  totalApplicants?: number;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  isNavigating?: boolean;
  /** @deprecated Use globalPosition / totalApplicants for paginated lists */
  currentIndex?: number;
  /** @deprecated Use totalApplicants for paginated lists */
  totalEnrollments?: number;
};

function cleanUrl(url?: string) {
  return url?.replace(/[`'"]/g, "").trim() ?? "";
}

function getStatusVariant(
  status: string,
): "pending" | "admitted" | "declined" | "graduated" | "default" {
  const normalized = status.toLowerCase();
  if (normalized === "admitted") return "admitted";
  if (normalized === "pending") return "pending";
  if (normalized === "declined") return "declined";
  if (normalized === "graduated") return "graduated";
  return "default";
}

function DetailItem({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className='flex gap-3 py-2.5 border-b border-[#27156F]/5 last:border-0'>
      {icon && (
        <span className='mt-0.5 shrink-0 text-[#27156F]/50'>{icon}</span>
      )}
      <div className='min-w-0 flex-1'>
        <p className='text-[11px] font-medium uppercase tracking-wide text-gray-500'>
          {label}
        </p>
        <div className='mt-0.5 text-sm text-[#27156F] break-words'>
          {children}
        </div>
      </div>
    </div>
  );
}

function CvPreview({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const clean = cleanUrl(url);
  const isPdf = /\.pdf/i.test(clean);

  if (!isPdf) {
    return (
      <div className='flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center'>
        <FileText className='mb-2 size-8 text-red-400' />
        <p className='font-medium text-red-700'>Invalid CV format</p>
        <p className='mt-1 text-sm text-red-500'>
          Only PDF documents can be previewed here.
        </p>
      </div>
    );
  }

  return (
    <div className='relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-[#27156F]/10 bg-gray-50'>
      <div className='flex items-center justify-between gap-2 border-b border-[#27156F]/10 bg-white px-3 py-2'>
        <span className='text-xs font-medium text-gray-600'>CV Preview</span>
        <div className='flex shrink-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-1.5 text-xs'
            asChild
          >
            <a href={clean} target='_blank' rel='noopener noreferrer' download>
              <FileText className='size-3.5' />
              Download CV
            </a>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-1.5 text-xs'
            asChild
          >
            <a href={clean} target='_blank' rel='noopener noreferrer'>
              Open full screen
              <ExternalLink className='size-3.5' />
            </a>
          </Button>
        </div>
      </div>
      <div className='relative flex-1'>
        {loading && !failed && (
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-50'>
            <Loader2 className='size-6 animate-spin text-[#27156F]' />
            <p className='text-sm text-gray-500'>Loading CV...</p>
          </div>
        )}
        {failed ? (
          <div className='flex h-full min-h-[280px] flex-col items-center justify-center p-6 text-center'>
            <FileText className='mb-2 size-8 text-gray-400' />
            <p className='text-sm text-gray-600'>Could not load CV preview.</p>
            <Button variant='outline' size='sm' className='mt-3' asChild>
              <a href={clean} target='_blank' rel='noopener noreferrer'>
                Open in new tab
              </a>
            </Button>
          </div>
        ) : (
          <iframe
            src={`${clean}#toolbar=0&navpanes=0`}
            title='Applicant CV'
            className='h-full min-h-[320px] w-full bg-white lg:min-h-[480px]'
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export const ApplicantInfoModal = ({
  isOpen,
  onOpenChange,
  enrollment,
  globalPosition,
  totalApplicants,
  canGoPrev,
  canGoNext,
  isNavigating = false,
  currentIndex,
  totalEnrollments,
  onNavigate,
}: Props) => {
  const displayPosition =
    globalPosition ?? (currentIndex !== undefined ? currentIndex + 1 : 1);
  const displayTotal = totalApplicants ?? totalEnrollments ?? 1;
  const prevDisabled = canGoPrev !== undefined ? !canGoPrev : currentIndex === 0;
  const nextDisabled =
    canGoNext !== undefined
      ? !canGoNext
      : currentIndex !== undefined &&
        totalEnrollments !== undefined &&
        currentIndex >= totalEnrollments - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className='flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl lg:max-w-6xl'
      >
        <DialogHeader className='shrink-0 border-b border-[#27156F]/10 px-6 py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <DialogTitle className='text-left'>
              Applicant Information
            </DialogTitle>
            <div className='flex items-center gap-2 self-end sm:self-auto'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onNavigate("prev")}
                disabled={prevDisabled || isNavigating}
                aria-label='Previous applicant'
              >
                <ChevronLeft className='size-4' />
              </Button>
              <span className='min-w-[5rem] text-center text-sm tabular-nums text-gray-500'>
                {displayPosition} / {displayTotal}
              </span>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onNavigate("next")}
                disabled={nextDisabled || isNavigating}
                aria-label='Next applicant'
              >
                <ChevronRight className='size-4' />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {enrollment ? (
          <ApplicantInfoModalContent
            enrollment={enrollment}
            onOpenChange={onOpenChange}
            disabled={isNavigating}
            isNavigating={isNavigating}
          />
        ) : (
          <div className='flex min-h-[320px] flex-1 flex-col items-center justify-center gap-3 p-6'>
            <Loader2 className='size-8 animate-spin text-[#27156F]' />
            <p className='text-sm text-gray-500'>Loading applicant...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function ApplicantInfoModalContent({
  enrollment,
  onOpenChange,
  disabled = false,
  isNavigating = false,
}: {
  enrollment: EnrollmentType;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  isNavigating?: boolean;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    status: enrollment.status,
    level: enrollment.level,
  });
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    setFormData({
      status: enrollment.status,
      level: enrollment.level,
    });
    setUpdateError("");
  }, [enrollment._id, enrollment.status, enrollment.level]);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      level,
    }: {
      id: string;
      status: string;
      level: string;
    }) => {
      const res = await fetch(`/api/applicant/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, level }),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to update applicant"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cohort-applicants", slug],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["cohort-applicants-stats", slug],
        exact: false,
      });
      toast.success("Applicant updated successfully");
      setUpdateError("");
    },
    onError: (error: Error) => {
      const message = error.message || "Failed to update applicant";
      setUpdateError(message);
      toast.error(message);
    },
  });

  const hasChanges =
    formData.status !== enrollment.status ||
    formData.level !== enrollment.level;

  const handleSave = () => {
    setUpdateError("");
    updateMutation.mutate({
      id: enrollment._id,
      status: formData.status,
      level: formData.level,
    });
  };

  const {
    profilePicture,
    phoneNumber,
    surname,
    otherNames,
    email,
    state,
    gender,
    course,
    cv,
    createdAt,
    employmentStatus,
  } = enrollment;

  const fullName = `${surname} ${otherNames}`.trim();
  const profileUrl = cleanUrl(profilePicture?.url);
  const cvUrl = cleanUrl(cv?.url);
  const appliedDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const isUpdating = updateMutation.isPending;

  return (
    <>
        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity duration-200",
            isNavigating && "opacity-40",
          )}
        >
          {isNavigating && (
            <div
              className='absolute inset-0 z-20 flex items-center justify-center bg-white/30'
              aria-busy='true'
              aria-live='polite'
            >
              <div className='flex flex-col items-center gap-2 rounded-xl border border-[#27156F]/10 bg-white px-5 py-4 shadow-sm'>
                <Loader2 className='size-6 animate-spin text-[#27156F]' />
                <p className='text-sm text-gray-600'>Loading applicant...</p>
              </div>
            </div>
          )}
        <div className='flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row'>
          {/* Left: profile + details */}
          <div className='w-full shrink-0 border-b border-[#27156F]/10 p-6 overflow-y-scroll lg:w-[380px] lg:border-b-0 lg:border-r'>
            <div className='mb-5 flex items-start gap-4'>
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={fullName}
                  className='size-16 shrink-0 rounded-full border-2 border-[#27156F]/10 object-cover'
                />
              ) : (
                <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-[#DBEAF6] text-lg font-bold text-[#27156F]'>
                  {surname?.[0]}
                  {otherNames?.[0]}
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <h3 className='text-lg font-bold leading-tight text-[#27156F]'>
                  {fullName}
                </h3>
                <div className='mt-2 flex flex-wrap gap-2'>
                  <span className='inline-flex items-center rounded-full bg-[#27156F]/5 px-2.5 py-0.5 text-xs font-medium capitalize text-[#27156F] ring-1 ring-inset ring-[#27156F]/15'>
                    {formData.level}
                  </span>
                  <TableStatusBadge variant={getStatusVariant(formData.status)}>
                    {formData.status}
                  </TableStatusBadge>
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Contact
              </p>
              <DetailItem label='Email' icon={<Mail className='size-3.5' />}>
                <a
                  href={`mailto:${email}`}
                  className='text-[#27156F] hover:text-[#E02B20] hover:underline'
                >
                  {email}
                </a>
              </DetailItem>
              <DetailItem label='Phone' icon={<Phone className='size-3.5' />}>
                <a href={`tel:${phoneNumber}`} className='hover:underline'>
                  {phoneNumber}
                </a>
              </DetailItem>
              <DetailItem
                label='Location'
                icon={<MapPin className='size-3.5' />}
              >
                {state}
              </DetailItem>
            </div>

            <div className='mb-4'>
              <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Application
              </p>
              <DetailItem label='Course'>{String(course)}</DetailItem>
              <DetailItem label='Gender'>
                <span className='capitalize'>{gender}</span>
              </DetailItem>
              <DetailItem label='Employment'>
                <span className='capitalize'>
                  {employmentStatus?.replace("-", " ") || "N/A"}
                </span>
              </DetailItem>
              <DetailItem label='Applied'>{appliedDate}</DetailItem>
            </div>

            <div className='mb-4 rounded-xl border border-[#27156F]/10 bg-[#DBEAF6]/25 p-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-[#27156F]'>
                Update application
              </p>
              {updateError && (
                <FormErrorBanner
                  message={updateError}
                  onDismiss={() => setUpdateError("")}
                />
              )}
              <div className='space-y-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='modal-level'>Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, level: value }));
                      setUpdateError("");
                    }}
                    disabled={isUpdating || disabled}
                  >
                    <SelectTrigger id='modal-level' className='w-full bg-white'>
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((opt) => (
                        <SelectItem
                          key={opt}
                          value={opt}
                          className='capitalize'
                        >
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='modal-status'>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, status: value }));
                      setUpdateError("");
                    }}
                    disabled={isUpdating || disabled}
                  >
                    <SelectTrigger
                      id='modal-status'
                      className='w-full bg-white'
                    >
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem
                          key={opt}
                          value={opt}
                          className='capitalize'
                        >
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Mobile CV preview */}
            {cvUrl && (
              <div className='mt-6 lg:hidden'>
                <CvPreview url={cvUrl} />
              </div>
            )}
          </div>

          {/* Right: CV preview (desktop) */}
          {cvUrl && (
            <div className='hidden min-h-0 flex-1 p-6 lg:flex lg:flex-col'>
              <CvPreview url={cvUrl} />
            </div>
          )}

          {!cvUrl && (
            <div className='hidden flex-1 items-center justify-center p-6 lg:flex'>
              <div className='text-center text-gray-500'>
                <FileText className='mx-auto mb-2 size-10 text-gray-300' />
                <p className='text-sm'>No CV uploaded for this applicant.</p>
              </div>
            </div>
          )}
        </div>
        </div>

        <DialogFooter className='shrink-0 border-t border-[#27156F]/10 px-6 py-4 sm:justify-between'>
          <p className='hidden text-xs text-gray-500 sm:block'>
            {hasChanges ? "Unsaved changes" : "No pending changes"}
          </p>
          <div className='flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
              className='border-[#27156F]/20'
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isUpdating || disabled}
              className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
            >
              {isUpdating && <Loader2 className='size-4 animate-spin' />}
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
    </>
  );
};
