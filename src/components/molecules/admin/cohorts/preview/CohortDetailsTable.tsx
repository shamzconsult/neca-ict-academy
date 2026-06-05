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

export function CohortDetailsTable({
  cohort,
  isLoading,
}: {
  cohort?: CohortDetails | CohortType | null;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <TableContainer className='mb-8'>
        <div className='border-b border-[#27156F]/10 bg-[#DBEAF6]/30 px-4 py-3'>
          <div className='h-5 w-32 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='space-y-3 p-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-4 animate-pulse rounded bg-gray-100' />
          ))}
        </div>
      </TableContainer>
    );
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
            {formatDate(cohort.applicationStartDate)} —{" "}
            {formatDate(cohort.applicationEndDate)}
          </DetailRow>
          <DetailRow label='Cohort Duration'>
            {formatDate(cohort.startDate)} — {formatDate(cohort.endDate)}
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
