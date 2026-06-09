"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableStatusBadge,
} from "@/components/atom/Table/Table";
import { CohortType } from "@/types";
import { Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

type CourseRef = { _id: string; title: string; slug?: string };

type CohortDetails = {
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  active?: boolean;
  courses?: CourseRef[] | string[];
  createdAt?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function parseDateOnly(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return Number.NaN;
  return Date.UTC(year, month - 1, day);
}

function daySpanInclusive(start?: string, end?: string) {
  if (!start || !end) return null;
  const startMs = parseDateOnly(start);
  const endMs = parseDateOnly(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) {
    return null;
  }
  return Math.floor((endMs - startMs) / 86_400_000) + 1;
}

function formatDurationLabel(days: number) {
  if (days >= 365) {
    const count = Math.floor(days / 365);
    return `${count} ${count === 1 ? "year" : "years"}`;
  }
  if (days >= 30) {
    const count = Math.floor(days / 30);
    return `${count} ${count === 1 ? "month" : "months"}`;
  }
  if (days >= 7) {
    const count = Math.floor(days / 7);
    return `${count} ${count === 1 ? "week" : "weeks"}`;
  }
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function formatDateRange(start?: string, end?: string) {
  const durationDays = daySpanInclusive(start, end);
  const duration =
    durationDays != null ? formatDurationLabel(durationDays) : null;

  return (
    <>
      {formatDate(start)} — {formatDate(end)}
      {duration ? (
        <span className='ml-2 text-gray-500'>({duration})</span>
      ) : null}
    </>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TableRow className='hover:bg-transparent'>
      <TableCell className='w-[180px] bg-gray-50/80 font-medium text-gray-600 text-sm'>
        {label}
      </TableCell>
      <TableCell className='text-sm text-[#27156F]'>{children}</TableCell>
    </TableRow>
  );
}

const SkeletonBar = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200/80 ${className}`.trim()}
    aria-hidden
  />
);

function CohortDetailsSkeleton() {
  return (
    <TableContainer className='mb-8'>
      <div className='flex items-center gap-2 border-b border-[#27156F]/10 bg-[#DBEAF6]/30 px-4 py-3'>
        <Calendar className='size-4 text-[#27156F]/30' aria-hidden />
        <SkeletonBar className='h-5 w-32' />
      </div>
      <Table className='min-w-0'>
        <TableBody>
          <DetailRow label='Cohort Name'>
            <SkeletonBar className='h-4 w-48 max-w-full' />
          </DetailRow>
          <DetailRow label='Status'>
            <SkeletonBar className='h-6 w-16 rounded-full' />
          </DetailRow>
          <DetailRow label='Application Window'>
            <SkeletonBar className='h-4 w-72 max-w-full' />
          </DetailRow>
          <DetailRow label='Cohort Duration'>
            <SkeletonBar className='h-4 w-72 max-w-full' />
          </DetailRow>
          <DetailRow label='Linked Courses'>
            <ul className='flex flex-col gap-1.5'>
              {Array.from({ length: 2 }).map((_, i) => (
                <li key={i} className='flex items-center gap-2'>
                  <SkeletonBar className='size-3.5 shrink-0 rounded-sm' />
                  <SkeletonBar className='h-4 w-44 max-w-full' />
                </li>
              ))}
            </ul>
          </DetailRow>
          <DetailRow label='Created'>
            <SkeletonBar className='h-4 w-28' />
          </DetailRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function CohortDetailsTable({
  cohort,
  isLoading,
}: {
  cohort?: CohortDetails | CohortType | null;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <CohortDetailsSkeleton />;
  }

  if (!cohort) return null;

  const courses = (cohort.courses ?? []) as CourseRef[];
  const courseList = courses.filter(
    (c): c is CourseRef => typeof c === "object" && c !== null && "title" in c,
  );

  return (
    <TableContainer className='mb-8'>
      <div className='flex items-center gap-2 border-b border-[#27156F]/10 bg-[#DBEAF6]/30 px-4 py-3'>
        <Calendar className='size-4 text-[#27156F]' />
        <h2 className='font-semibold text-[#27156F]'>Cohort Details</h2>
      </div>
      <Table className='min-w-0'>
        <TableBody>
          <DetailRow label='Cohort Name'>{cohort.name}</DetailRow>
          <DetailRow label='Status'>
            <TableStatusBadge variant={cohort.active ? "active" : "inactive"}>
              {cohort.active ? "Active" : "Inactive"}
            </TableStatusBadge>
          </DetailRow>
          <DetailRow label='Application Window'>
            {formatDateRange(
              cohort.applicationStartDate,
              cohort.applicationEndDate,
            )}
          </DetailRow>
          <DetailRow label='Cohort Duration'>
            {formatDateRange(cohort.startDate, cohort.endDate)}
          </DetailRow>
          <DetailRow label={`Linked Courses (${courseList.length})`}>
            {courseList.length > 0 ? (
              <ul className='flex flex-col gap-1.5'>
                {courseList.map((course) => (
                  <li key={course._id} className='flex items-center gap-2'>
                    <BookOpen className='size-3.5 shrink-0 text-[#27156F]/60' />
                    {course.slug ? (
                      <Link
                        href={`/courses/${course.slug}`}
                        target='_blank'
                        className='text-[#27156F] hover:text-[#E02B20] hover:underline'
                      >
                        {course.title}
                      </Link>
                    ) : (
                      <span>{course.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span className='text-gray-500'>No courses linked</span>
            )}
          </DetailRow>
          {"createdAt" in cohort && cohort.createdAt && (
            <DetailRow label='Created'>
              {formatDate(cohort.createdAt as string)}
            </DetailRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
