"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/atom/EmptyState";
import { TableStatusBadge } from "@/components/atom/Table/Table";
import { FormErrorBanner } from "@/components/atom/form/FormFeedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CohortCourseSelect } from "@/components/ui/cohort-course-select";
import { levelOptions, statusOptions } from "@/const";
import { parseApiError } from "@/lib/parse-api-error";
import { formatDisplayDate } from "@/utils/format-date";

type ApplicantProfile = {
  _id: string;
  surname: string;
  otherNames: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  profilePicture: { url: string; public_id: string } | null;
};

type EnrollmentRecord = {
  _id: string;
  status: string;
  level: string;
  employmentStatus: string;
  cv?: { url: string; public_id: string } | null;
  createdAt: string;
  updatedAt: string;
  cohort: {
    _id: string;
    name: string;
    slug: string;
    startDate?: string;
    endDate?: string;
  };
  course: {
    _id: string;
    title: string;
  };
};

type GraduateDetailResponse = {
  success: boolean;
  applicant: ApplicantProfile;
  focusEnrollmentId: string;
  focusEnrollment: EnrollmentRecord;
  enrollments: EnrollmentRecord[];
};

function cleanUrl(url?: string | null) {
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

function CvPreview({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const clean = cleanUrl(url);
  const isPdf = /\.pdf/i.test(clean);

  useEffect(() => {
    setLoading(true);
    setFailed(false);
  }, [url]);

  if (!isPdf) {
    return (
      <div className='flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center'>
        <FileText className='mb-2 size-8 text-red-400' />
        <p className='font-medium text-red-700'>Invalid CV format</p>
        <p className='mt-1 text-sm text-red-500'>
          Only PDF documents can be previewed here.
        </p>
      </div>
    );
  }

  return (
    <div className='relative flex min-h-[360px] flex-col overflow-hidden rounded-xl border border-[#27156F]/10 bg-gray-50 lg:min-h-[560px]'>
      <div className='flex items-center justify-between gap-2 border-b border-[#27156F]/10 bg-white px-4 py-3'>
        <span className='text-sm font-medium text-[#27156F]'>
          CV for this application
        </span>
        <div className='flex shrink-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-1.5 text-xs'
            asChild
          >
            <a href={clean} target='_blank' rel='noopener noreferrer' download>
              <FileText className='size-3.5' />
              Download
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
      <div className='relative min-h-[320px] flex-1 lg:min-h-[500px]'>
        {loading && !failed && (
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-50'>
            <Loader2 className='size-6 animate-spin text-[#27156F]' />
            <p className='text-sm text-gray-500'>Loading CV...</p>
          </div>
        )}
        {failed ? (
          <div className='flex h-full min-h-[320px] flex-col items-center justify-center p-6 text-center'>
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
            key={clean}
            src={`${clean}#toolbar=0&navpanes=0`}
            title='Applicant CV'
            className='h-full min-h-[320px] w-full bg-white lg:min-h-[500px]'
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

function GraduateDetailTopBar({ fullName }: { fullName?: string }) {
  return (
    <header className='mb-5 flex flex-wrap items-center justify-between gap-3'>
      <nav aria-label='Breadcrumb' className='min-w-0 flex-1'>
        <ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
          <li>
            <Link
              href='/admin/graduates'
              className='inline-flex items-center gap-1.5 font-medium text-gray-500 transition-colors hover:text-[#27156F]'
            >
              <ArrowLeft className='size-3.5' />
              Graduates
            </Link>
          </li>
          {fullName && (
            <>
              <li aria-hidden='true' className='text-gray-300'>
                /
              </li>
              <li className='min-w-0'>
                <span
                  className='line-clamp-1 font-medium text-[#27156F]'
                  aria-current='page'
                >
                  {fullName}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    </header>
  );
}

function EnrollmentHistorySelect({
  enrollments,
  value,
  onValueChange,
}: {
  enrollments: EnrollmentRecord[];
  value: string;
  onValueChange: (id: string) => void;
}) {
  const options = enrollments.map((enrollment) => {
    const year = new Date(enrollment.createdAt).getFullYear();
    return {
      value: enrollment._id,
      label: `${year} · ${enrollment.cohort.name} · ${enrollment.course.title}`,
    };
  });

  const selected = enrollments.find((e) => e._id === value);

  return (
    <section className='mb-4 rounded-2xl border border-[#27156F]/10 bg-white p-4 shadow-sm sm:p-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0 flex-1 space-y-1.5'>
          <Label htmlFor='cohort-history-select' className='text-[#27156F]'>
            Cohort application
          </Label>
          <p className='text-xs text-gray-500'>
            {enrollments.length === 1
              ? "One application on record."
              : "Choose an application to view its profile and CV."}
          </p>
          <CohortCourseSelect
            id='cohort-history-select'
            size='form'
            value={value}
            onValueChange={onValueChange}
            disabled={enrollments.length <= 1}
            placeholder='Select application'
            options={options}
            triggerClassName='max-w-xl'
            contentClassName='max-w-xl min-w-[var(--radix-select-trigger-width)]'
          />
        </div>
        {selected && (
          <Button
            variant='outline'
            size='sm'
            className='shrink-0 border-[#27156F]/20'
            asChild
          >
            <Link
              href={`/admin/cohorts/${selected.cohort.slug}`}
              target='_blank'
            >
              Open cohort
              <ExternalLink className='size-3.5' />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}

function ProfileHero({
  applicant,
  activeEnrollment,
}: {
  applicant: ApplicantProfile;
  activeEnrollment: EnrollmentRecord;
}) {
  const fullName = `${applicant.surname} ${applicant.otherNames}`.trim();
  const profileUrl = cleanUrl(applicant.profilePicture?.url);

  return (
    <section className='mb-6 overflow-hidden rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 shadow-sm'>
      <div className='flex flex-col sm:flex-row sm:items-stretch'>
        <div className='relative h-56 w-full shrink-0 sm:h-auto sm:w-56 md:w-64'>
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={fullName}
              className='absolute inset-0 size-full object-cover'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center bg-[#DBEAF6] text-4xl font-bold text-[#27156F]/70 sm:text-5xl'>
              {applicant.surname?.[0]}
              {applicant.otherNames?.[0]}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1 space-y-3 p-5 sm:p-6'>
          <div>
            <h1 className='text-xl font-bold text-[#27156F] sm:text-2xl'>
              {fullName}
            </h1>
            <div className='mt-2 flex flex-wrap gap-2'>
              <span className='inline-flex items-center rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium capitalize text-[#27156F] ring-1 ring-inset ring-[#27156F]/15'>
                {activeEnrollment.level}
              </span>
              <TableStatusBadge
                variant={getStatusVariant(activeEnrollment.status)}
              >
                {activeEnrollment.status}
              </TableStatusBadge>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600'>
            <a
              href={`mailto:${applicant.email}`}
              className='inline-flex items-center gap-1.5 hover:text-[#27156F]'
            >
              <Mail className='size-3.5 shrink-0 text-[#27156F]/50' />
              {applicant.email}
            </a>
            <a
              href={`tel:${applicant.phoneNumber}`}
              className='inline-flex items-center gap-1.5 hover:text-[#27156F]'
            >
              <Phone className='size-3.5 shrink-0 text-[#27156F]/50' />
              {applicant.phoneNumber}
            </a>
            <span className='inline-flex items-center gap-1.5'>
              <MapPin className='size-3.5 shrink-0 text-[#27156F]/50' />
              {applicant.state}
            </span>
          </div>

          <div className='rounded-xl border border-[#27156F]/10 bg-white/70 px-4 py-3'>
            <p className='mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
              Selected application
            </p>
            <dl className='space-y-2.5 text-sm'>
              <div className='grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5'>
                <dt className='text-gray-500'>Cohort</dt>
                <dd
                  className='font-medium text-[#27156F]'
                  title={activeEnrollment.cohort.name}
                >
                  {activeEnrollment.cohort.name}
                </dd>
              </div>
              <div className='grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5'>
                <dt className='text-gray-500'>Course</dt>
                <dd className='text-[#27156F]'>
                  {activeEnrollment.course.title}
                </dd>
              </div>
              <div className='grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5'>
                <dt className='text-gray-500'>Applied</dt>
                <dd className='text-[#27156F]'>
                  {formatDisplayDate(activeEnrollment.createdAt)}
                </dd>
              </div>
              {applicant.gender && (
                <div className='grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5'>
                  <dt className='text-gray-500'>Gender</dt>
                  <dd className='capitalize text-[#27156F]'>
                    {applicant.gender}
                  </dd>
                </div>
              )}
              {activeEnrollment.employmentStatus && (
                <div className='grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5'>
                  <dt className='text-gray-500'>Employment</dt>
                  <dd className='capitalize text-[#27156F]'>
                    {activeEnrollment.employmentStatus.replace("-", " ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminActionsPanel({
  formData,
  setFormData,
  updateError,
  setUpdateError,
  isUpdating,
  hasChanges,
  onSave,
}: {
  formData: { status: string; level: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ status: string; level: string }>
  >;
  updateError: string;
  setUpdateError: (value: string) => void;
  isUpdating: boolean;
  hasChanges: boolean;
  onSave: () => void;
}) {
  return (
    <details
      open
      className='group rounded-xl border border-[#27156F]/10 bg-[#DBEAF6]/25'
    >
      <summary className='flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-[#27156F] [&::-webkit-details-marker]:hidden'>
        Admin actions
        <ChevronDown className='size-4 shrink-0 transition-transform group-open:rotate-180' />
      </summary>
      <div className='space-y-3 border-t border-[#27156F]/10 px-4 pb-4 pt-3'>
        <p className='text-xs text-gray-500'>
          Update level and status for this enrollment only.
        </p>
        {updateError && (
          <FormErrorBanner
            message={updateError}
            onDismiss={() => setUpdateError("")}
          />
        )}
        <div className='space-y-1.5'>
          <Label htmlFor='graduate-level'>Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, level: value }));
              setUpdateError("");
            }}
            disabled={isUpdating}
          >
            <SelectTrigger id='graduate-level' className='w-full bg-white'>
              <SelectValue placeholder='Select level' />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className='capitalize'>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='graduate-status'>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, status: value }));
              setUpdateError("");
            }}
            disabled={isUpdating}
          >
            <SelectTrigger id='graduate-status' className='w-full bg-white'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className='capitalize'>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onSave}
          disabled={!hasChanges || isUpdating}
          className='w-full gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
        >
          {isUpdating ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </details>
  );
}

export function GraduateDetail() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params?.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<GraduateDetailResponse>({
    queryKey: ["enrollment-detail", enrollmentId],
    queryFn: async () => {
      const res = await fetch(`/api/enrollments/${enrollmentId}`);
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to load graduate"));
      }
      return res.json();
    },
    enabled: !!enrollmentId,
  });

  const [activeEnrollmentId, setActiveEnrollmentId] = useState(enrollmentId);
  const [formData, setFormData] = useState({ status: "", level: "" });
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    setActiveEnrollmentId(enrollmentId);
  }, [enrollmentId]);

  const activeEnrollment = useMemo(
    () =>
      data?.enrollments.find((e) => e._id === activeEnrollmentId) ??
      data?.focusEnrollment,
    [data, activeEnrollmentId],
  );

  useEffect(() => {
    if (activeEnrollment) {
      setFormData({
        status: activeEnrollment.status,
        level: activeEnrollment.level,
      });
      setUpdateError("");
    }
  }, [
    activeEnrollment?._id,
    activeEnrollment?.status,
    activeEnrollment?.level,
  ]);

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
      const res = await fetch(`/api/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, level }),
      });
      if (!res.ok) {
        throw new Error(
          await parseApiError(res, "Failed to update enrollment"),
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enrollment-detail", enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["graduated-applicants"] });
      toast.success("Enrollment updated successfully");
      setUpdateError("");
    },
    onError: (err: Error) => {
      const message = err.message || "Failed to update enrollment";
      setUpdateError(message);
      toast.error(message);
    },
  });

  const handleSelectEnrollment = (id: string) => {
    setActiveEnrollmentId(id);
    router.replace(`/admin/graduates/${id}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <>
        <GraduateDetailTopBar />
        <div className='mb-4 h-24 animate-pulse rounded-2xl bg-gray-100' />
        <div className='mb-6 h-36 animate-pulse rounded-2xl bg-[#DBEAF6]/40' />
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]'>
          <div className='min-h-[480px] animate-pulse rounded-2xl bg-gray-100' />
          <div className='min-h-[320px] animate-pulse rounded-2xl bg-gray-100' />
        </div>
      </>
    );
  }

  if (error || !data?.success || !data.applicant || !activeEnrollment) {
    return (
      <>
        <GraduateDetailTopBar />
        <EmptyState
          title='Graduate not found'
          message={
            error?.message ??
            "This enrollment may have been removed or the link is invalid."
          }
          size='lg'
        />
        <div className='mt-6 flex justify-center'>
          <Button
            variant='outline'
            asChild
            className='gap-2 border-[#27156F]/20'
          >
            <Link href='/admin/graduates'>
              <ArrowLeft className='size-4' />
              Back to Graduates
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const fullName =
    `${data.applicant.surname} ${data.applicant.otherNames}`.trim();
  const cvUrl = cleanUrl(activeEnrollment.cv?.url);
  const hasChanges =
    formData.status !== activeEnrollment.status ||
    formData.level !== activeEnrollment.level;
  const isUpdating = updateMutation.isPending;

  return (
    <>
      <GraduateDetailTopBar fullName={fullName} />

      <EnrollmentHistorySelect
        enrollments={data.enrollments}
        value={activeEnrollmentId}
        onValueChange={handleSelectEnrollment}
      />

      <ProfileHero
        applicant={data.applicant}
        activeEnrollment={activeEnrollment}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_360px]'>
        <section className='overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white p-4 shadow-sm sm:p-5'>
          {cvUrl ? (
            <CvPreview url={cvUrl} />
          ) : (
            <div className='flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[#27156F]/20 bg-[#DBEAF6]/20 p-8 text-center lg:min-h-[560px]'>
              <FileText className='mb-2 size-10 text-gray-300' />
              <p className='text-sm font-medium text-gray-600'>
                No CV for this application
              </p>
              <p className='mt-1 text-xs text-gray-500'>
                Select another application above if they applied to a different
                cohort.
              </p>
            </div>
          )}
        </section>

        <aside>
          <AdminActionsPanel
            formData={formData}
            setFormData={setFormData}
            updateError={updateError}
            setUpdateError={setUpdateError}
            isUpdating={isUpdating}
            hasChanges={hasChanges}
            onSave={() =>
              updateMutation.mutate({
                id: activeEnrollment._id,
                status: formData.status,
                level: formData.level,
              })
            }
          />
        </aside>
      </div>
    </>
  );
}
