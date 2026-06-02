"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TableStatusBadge } from "./Table/Table";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type ApplicationStatus = "pending" | "admitted" | "declined" | "interview";

interface ApplicationReviewProps {
  onClose: () => void;
  applicantStatus: {
    status: ApplicationStatus;
    applicant: {
      surname: string;
      otherNames: string;
      profilePicture?: { url: string } | null;
    };
    cohort?: string | null;
    course?: string | null;
    level?: string | null;
  } | null;
  statusError: string;
}

type StatusConfig = {
  title: string;
  message: string;
  icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
  badge: "pending" | "admitted" | "declined" | "default";
  badgeLabel: string;
};

const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  pending: {
    title: "Application under review",
    message:
      "Your application is being reviewed by our team. We'll notify you by email once a decision has been made.",
    icon: Clock,
    iconWrap: "bg-amber-50",
    iconColor: "text-amber-600",
    badge: "pending",
    badgeLabel: "Pending",
  },
  interview: {
    title: "Interview scheduled",
    message:
      "You've been scheduled for an interview. Please check your email for date, time, and next steps.",
    icon: CalendarClock,
    iconWrap: "bg-[#DBEAF6]",
    iconColor: "text-[#27156F]",
    badge: "default",
    badgeLabel: "Interview",
  },
  admitted: {
    title: "Congratulations — you're admitted!",
    message:
      "You have been admitted to the cohort. Check your email for onboarding details and what to do next.",
    icon: CheckCircle2,
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: "admitted",
    badgeLabel: "Admitted",
  },
  declined: {
    title: "Application not successful",
    message:
      "Thank you for your interest in our program. While we can't offer you a spot this time, we encourage you to apply again in a future cohort.",
    icon: XCircle,
    iconWrap: "bg-red-50",
    iconColor: "text-[#E02B20]",
    badge: "declined",
    badgeLabel: "Declined",
  },
};

const UNKNOWN_CONFIG: StatusConfig = {
  title: "Unknown application status",
  message:
    "We couldn't determine your application status. Please contact support for assistance.",
  icon: HelpCircle,
  iconWrap: "bg-gray-100",
  iconColor: "text-gray-600",
  badge: "default",
  badgeLabel: "Unknown",
};

function cleanUrl(url?: string) {
  return url?.replace(/[`'"]/g, "").trim() ?? "";
}

function getInitials(surname?: string, otherNames?: string) {
  const first = surname?.[0] ?? "";
  const second = otherNames?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

function ApplicantAvatar({
  surname,
  otherNames,
  profilePicture,
}: {
  surname?: string;
  otherNames?: string;
  profilePicture?: { url: string } | null;
}) {
  const profileUrl = cleanUrl(profilePicture?.url);
  const initials = getInitials(surname, otherNames);

  if (profileUrl) {
    return (
      <img
        src={profileUrl}
        alt={`${surname ?? ""} ${otherNames ?? ""}`.trim() || "Applicant"}
        className='size-20 rounded-full border-[3px] border-white object-cover shadow-md ring-2 ring-[#27156F]/15'
      />
    );
  }

  return (
    <div className='flex size-20 items-center justify-center rounded-full border-[3px] border-white bg-[#27156F] text-xl font-bold text-white shadow-md ring-2 ring-[#27156F]/15'>
      {initials}
    </div>
  );
}

function ApplicantName({
  surname,
  otherNames,
}: {
  surname?: string;
  otherNames?: string;
}) {
  const fullName = [surname, otherNames].filter(Boolean).join(" ").trim();
  if (!fullName) return null;

  return (
    <p className='mt-3 text-base font-bold text-[#27156F] sm:text-lg'>
      {fullName}
    </p>
  );
}

function ApplicationDetails({
  cohort,
  course,
  level,
  statusLabel,
  statusVariant,
}: {
  cohort?: string | null;
  course?: string | null;
  level?: string | null;
  statusLabel?: string;
  statusVariant?: "pending" | "admitted" | "declined" | "default";
}) {
  if (!cohort && !course && !level && !statusLabel) return null;

  return (
    <div className='mt-4 w-full rounded-xl border border-[#27156F]/10 bg-[#DBEAF6]/25 p-4 text-left'>
      <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
        Application details
      </p>
      <dl className='space-y-3'>
        {cohort && (
          <div>
            <dt className='text-xs text-gray-500'>Cohort</dt>
            <dd className='mt-0.5 text-sm font-medium leading-snug text-[#27156F]'>
              {cohort}
            </dd>
          </div>
        )}
        {course && (
          <div>
            <dt className='text-xs text-gray-500'>Course</dt>
            <dd className='mt-0.5 text-sm font-medium leading-snug text-[#27156F]'>
              {course}
            </dd>
          </div>
        )}
        {level && (
          <div>
            <dt className='text-xs text-gray-500'>Level</dt>
            <dd className='mt-0.5 text-sm font-medium capitalize text-[#27156F]'>
              {level}
            </dd>
          </div>
        )}
        {statusLabel && statusVariant && (
          <div>
            <dt className='text-xs text-gray-500'>Status</dt>
            <dd className='mt-1'>
              <TableStatusBadge variant={statusVariant}>
                {statusLabel}
              </TableStatusBadge>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  onClose,
  applicantStatus,
  statusError,
}) => {
  const isOpen = !!applicantStatus || !!statusError;

  const activeConfig = applicantStatus
    ? (STATUS_CONFIG[applicantStatus.status] ?? UNKNOWN_CONFIG)
    : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md'>
        <div
          className={cn(
            "flex flex-col items-center border-b border-[#27156F]/10 px-6 pb-5 pt-8 text-center",
            statusError ? "bg-red-50/60" : "bg-[#DBEAF6]/30",
          )}
        >
          {statusError ? (
            <div className='mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-100'>
              <AlertCircle className='size-7 text-[#E02B20]' />
            </div>
          ) : (
            <>
              <ApplicantAvatar
                surname={applicantStatus?.applicant.surname}
                otherNames={applicantStatus?.applicant.otherNames}
                profilePicture={applicantStatus?.applicant.profilePicture}
              />
              <ApplicantName
                surname={applicantStatus?.applicant.surname}
                otherNames={applicantStatus?.applicant.otherNames}
              />
            </>
          )}
        </div>

        <div className='px-6 py-5 text-center'>
          <DialogHeader className='space-y-0'>
            <DialogTitle className='text-lg font-bold leading-snug text-[#27156F] sm:text-xl'>
              {statusError ?? activeConfig?.title}
            </DialogTitle>
          </DialogHeader>

          {!statusError && activeConfig && (
            <>
              <ApplicationDetails
                cohort={applicantStatus?.cohort}
                course={applicantStatus?.course}
                level={applicantStatus?.level}
                statusLabel={activeConfig.badgeLabel}
                statusVariant={activeConfig.badge}
              />
              <p className='mt-4 text-sm leading-relaxed text-gray-600'>
                {activeConfig.message}
              </p>
            </>
          )}

          {statusError && (
            <p className='mt-3 text-sm leading-relaxed text-gray-600'>
              Please double-check your email address and try again. If the issue
              persists, contact the academy support team.
            </p>
          )}
        </div>

        <DialogFooter className='border-t border-[#27156F]/10 px-6 py-4'>
          <Button
            type='button'
            onClick={onClose}
            className='w-full gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90 sm:w-auto sm:ml-auto'
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
