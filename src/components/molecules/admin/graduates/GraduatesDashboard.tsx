"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Search,
  SquareLibrary,
} from "lucide-react";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";
import EmptyState from "@/components/atom/EmptyState";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CohortCourseSelect } from "@/components/ui/cohort-course-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Graduate = {
  id: string;
  fullName: string;
  profilePicture: string | null;
  year: number;
  cohort: string;
  course: string;
};

const YEAR_SELECT_TRIGGER =
  "h-9 w-32 shrink-0 overflow-hidden border-[#27156F]/15 bg-white [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:flex-1 [&_[data-slot=select-value]]:truncate [&_[data-slot=select-value]]:whitespace-nowrap [&_[data-slot=select-value]]:text-left";

const YEAR_SELECT_CONTENT = "w-32 min-w-32 max-w-32";

const YEAR_SELECT_ITEM =
  "min-w-0 h-auto min-h-9 items-start whitespace-normal py-2 text-left leading-snug normal-case";

function cleanUrl(url?: string | null) {
  return url?.replace(/[`'"]/g, "").trim() ?? "";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function GraduateCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white shadow-sm'>
      <div className='aspect-[4/5] animate-pulse bg-gray-200' />
      <div className='space-y-3 p-4'>
        <div className='h-5 w-3/4 animate-pulse rounded bg-gray-200' />
        <div className='h-4 w-1/3 animate-pulse rounded bg-gray-100' />
        <div className='h-4 w-full animate-pulse rounded bg-gray-100' />
        <div className='h-4 w-2/3 animate-pulse rounded bg-gray-100' />
      </div>
    </div>
  );
}

function GraduatesFilterSkeleton() {
  return (
    <>
      <div
        className='mb-8 flex flex-col gap-4 rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-4 lg:flex-row lg:items-center lg:justify-between'
        aria-hidden
      >
        <div className='h-9 w-full animate-pulse rounded-md bg-gray-200/80 lg:max-w-md' />
        <div className='flex flex-wrap items-center gap-2'>
          <div className='h-9 w-32 animate-pulse rounded-md bg-gray-200/80' />
          <div className='h-9 w-52 animate-pulse rounded-md bg-gray-200/80' />
          <div className='h-9 w-52 animate-pulse rounded-md bg-gray-200/80' />
        </div>
      </div>
      <div className='-mt-4 mb-6 h-4 w-48 animate-pulse rounded bg-gray-100' aria-hidden />
    </>
  );
}

function GraduateCard({ graduate }: { graduate: Graduate }) {
  const profileUrl = cleanUrl(graduate.profilePicture);
  const initials = getInitials(graduate.fullName);

  return (
    <Link
      href={`/admin/graduates/${graduate.id}`}
      className='group block overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#27156F]/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27156F]/40'
    >
      <div className='relative aspect-[4/5] overflow-hidden bg-[#DBEAF6]/40'>
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={graduate.fullName}
            className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex size-full items-center justify-center bg-gradient-to-br from-[#DBEAF6] to-[#27156F]/10'>
            <span className='text-4xl font-bold text-[#27156F]/70'>
              {initials}
            </span>
          </div>
        )}
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#27156F]/90 via-[#27156F]/50 to-transparent px-4 pb-4 pt-16'>
          <Badge className='mb-2 border-0 bg-white/20 text-white backdrop-blur-sm hover:bg-white/20'>
            Class of {graduate.year}
          </Badge>
          <h3 className='line-clamp-2 text-lg font-bold leading-snug text-white'>
            {graduate.fullName}
          </h3>
        </div>
        <div className='absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#27156F] shadow-sm'>
          <GraduationCap className='size-4' />
        </div>
      </div>

      <div className='space-y-2.5 p-4'>
        <div className='flex items-start gap-2 text-sm text-gray-600'>
          <SquareLibrary className='mt-0.5 size-4 shrink-0 text-[#27156F]/60' />
          <span className='line-clamp-2 font-medium text-[#27156F]/90'>
            {graduate.cohort}
          </span>
        </div>
        <div className='flex items-start gap-2 text-sm text-gray-600'>
          <BookOpen className='mt-0.5 size-4 shrink-0 text-[#E02B20]/70' />
          <span className='line-clamp-2'>{graduate.course}</span>
        </div>
      </div>
    </Link>
  );
}

export function GraduatesDashboard() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const { data, isLoading, error } = useQuery<{
    success: boolean;
    data: Graduate[];
    total: number;
  }>({
    queryKey: ["graduated-applicants"],
    queryFn: async () => {
      const res = await fetch("/api/applicants/graduated");
      if (!res.ok) throw new Error("Failed to fetch graduates");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const graduates = data?.data ?? [];

  const years = useMemo(
    () =>
      [...new Set(graduates.map((g) => g.year))].sort((a, b) => b - a),
    [graduates],
  );

  const graduatesForYear = useMemo(() => {
    if (yearFilter === "all") return graduates;
    const year = Number(yearFilter);
    return graduates.filter((g) => g.year === year);
  }, [graduates, yearFilter]);

  const cohortOptions = useMemo(
    () => [...new Set(graduatesForYear.map((g) => g.cohort))].sort(),
    [graduatesForYear],
  );

  const graduatesForCohort = useMemo(() => {
    if (cohortFilter === "all") return graduatesForYear;
    return graduatesForYear.filter((g) => g.cohort === cohortFilter);
  }, [graduatesForYear, cohortFilter]);

  const courseOptions = useMemo(
    () => [...new Set(graduatesForCohort.map((g) => g.course))].sort(),
    [graduatesForCohort],
  );

  const handleYearChange = (value: string) => {
    setYearFilter(value);
    setCohortFilter("all");
    setCourseFilter("all");
  };

  const handleCohortChange = (value: string) => {
    setCohortFilter(value);
    setCourseFilter("all");
  };

  const filteredGraduates = useMemo(() => {
    const q = search.trim().toLowerCase();

    return graduates.filter((g) => {
      if (yearFilter !== "all" && g.year !== Number(yearFilter)) return false;
      if (cohortFilter !== "all" && g.cohort !== cohortFilter) return false;
      if (courseFilter !== "all" && g.course !== courseFilter) return false;
      if (q && !g.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [graduates, search, yearFilter, cohortFilter, courseFilter]);

  const hasFilters =
    !!search.trim() ||
    yearFilter !== "all" ||
    cohortFilter !== "all" ||
    courseFilter !== "all";

  return (
    <>
      <AdminSectionHeader
        title='Graduates'
        icon={GraduationCap}
        cta={
          !isLoading && graduates.length > 0 ? (
            <Badge
              variant='outline'
              className='border-[#27156F]/20 bg-[#DBEAF6]/40 px-3 py-1.5 text-sm font-semibold text-[#27156F]'
            >
              {graduates.length} graduate{graduates.length === 1 ? "" : "s"}
            </Badge>
          ) : undefined
        }
      />

      {!isLoading && graduates.length > 0 && (
        <div className='mb-8 flex flex-col gap-4 rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='relative w-full lg:max-w-md'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='search'
              placeholder='Search by name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='border-[#27156F]/15 bg-white pl-9'
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Select value={yearFilter} onValueChange={handleYearChange}>
              <SelectTrigger className={YEAR_SELECT_TRIGGER}>
                <SelectValue placeholder='All years' />
              </SelectTrigger>
              <SelectContent className={YEAR_SELECT_CONTENT}>
                <SelectItem value='all' className={YEAR_SELECT_ITEM}>
                  All years
                </SelectItem>
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={String(year)}
                    className={YEAR_SELECT_ITEM}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CohortCourseSelect
              value={cohortFilter}
              onValueChange={handleCohortChange}
              disabled={cohortOptions.length === 0}
              placeholder={
                yearFilter !== "all" ? "Cohorts in year" : "All cohorts"
              }
              allOption={{ value: "all", label: "All cohorts" }}
              options={cohortOptions.map((cohort) => ({
                value: cohort,
                label: cohort,
              }))}
            />
            <CohortCourseSelect
              value={courseFilter}
              onValueChange={setCourseFilter}
              disabled={cohortFilter === "all" || courseOptions.length === 0}
              placeholder='Select cohort first'
              allOption={{ value: "all", label: "All courses" }}
              options={courseOptions.map((course) => ({
                value: course,
                label: course,
              }))}
            />
          </div>
        </div>
      )}

      {!isLoading && graduates.length > 0 && (
        <p className='-mt-4 mb-6 text-sm text-gray-500'>
          Showing {filteredGraduates.length} of {graduates.length} graduate
          {graduates.length === 1 ? "" : "s"}
          {hasFilters && <span className='text-gray-400'> (filtered)</span>}
        </p>
      )}

      {error ? (
        <EmptyState
          title='Failed to load graduates'
          message={error.message}
          size='lg'
        />
      ) : isLoading ? (
        <>
          <GraduatesFilterSkeleton />
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <GraduateCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : graduates.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-[#27156F]/20 bg-[#DBEAF6]/20 py-16'>
          <EmptyState
            title='No graduates yet'
            message='Graduated applicants will appear here once their status is updated.'
            size='lg'
            className='border-0'
          />
        </div>
      ) : filteredGraduates.length === 0 ? (
        <EmptyState
          title='No matching graduates'
          message='Try adjusting your search or filters.'
          size='lg'
        />
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {filteredGraduates.map((graduate) => (
            <GraduateCard key={graduate.id} graduate={graduate} />
          ))}
        </div>
      )}
    </>
  );
}
