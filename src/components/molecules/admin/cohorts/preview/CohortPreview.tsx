"use client";

import React, { useEffect, useState } from "react";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atom/Table/Table";
import EmptyState from "@/components/atom/EmptyState";
import { ApplicantTr } from "./applicant-tr";
import { CohortDetailsTable } from "./CohortDetailsTable";
import { Pagination } from "@/components/atom/Pagination";
import { states, statusOptions } from "@/const";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CohortCourseSelect } from "@/components/ui/cohort-course-select";
import { Input } from "@/components/ui/input";
import { EnrollmentsType, CohortType, EnrollmentType } from "@/types";
import { ApplicantInfoModal } from "./applicant-info-modal";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

function parsePageSize(value: string | null) {
  const parsed = Number(value);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : DEFAULT_PAGE_SIZE;
}

type CourseRef = { _id: string; title: string; slug?: string };

function getCohortCourses(
  courses: CohortType["courses"] | CourseRef[] | undefined,
) {
  if (!courses || !Array.isArray(courses)) return [];
  return courses.filter(
    (c): c is CourseRef => typeof c === "object" && c !== null && "title" in c,
  );
}

const APPLICANT_TABLE_HEADERS = [
  "Applicants",
  "Location",
  "Application Date",
  "Level",
  "Status",
  "Review",
] as const;

const STAT_ITEMS = [
  {
    key: "total",
    label: "Total",
    icon: Users,
    color: "text-[#27156F]",
    bg: "bg-[#27156F]/10",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "declined",
    label: "Declined",
    icon: XCircle,
    color: "text-[#E02B20]",
    bg: "bg-red-50",
  },
  {
    key: "admitted",
    label: "Admitted",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "graduated",
    label: "Graduated",
    icon: GraduationCap,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
] as const;

const SkeletonBar = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} />
);

const ApplicantRowSkeleton = () => (
  <TableRow className='hover:bg-transparent'>
    <TableCell>
      <div className='flex items-center gap-3'>
        <SkeletonBar className='size-9 shrink-0 rounded-full' />
        <div className='min-w-0 flex-1 space-y-2'>
          <SkeletonBar className='h-4 w-36 max-w-full' />
          <SkeletonBar className='h-3 w-44 max-w-full' />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <SkeletonBar className='h-4 w-20' />
    </TableCell>
    <TableCell>
      <SkeletonBar className='h-4 w-24' />
    </TableCell>
    <TableCell>
      <SkeletonBar className='h-4 w-16' />
    </TableCell>
    <TableCell align='center'>
      <SkeletonBar className='mx-auto h-6 w-20 rounded-full' />
    </TableCell>
    <TableCell align='center'>
      <SkeletonBar className='mx-auto h-8 w-[5.5rem] rounded-md' />
    </TableCell>
  </TableRow>
);

const PaginationSkeleton = () => (
  <div className='flex flex-wrap items-center justify-center gap-1' aria-hidden>
    <SkeletonBar className='h-9 w-[5.75rem] rounded-md sm:w-24' />
    <div className='flex items-center gap-1 px-1'>
      {Array.from({ length: 5 }).map((_, idx) => (
        <SkeletonBar key={idx} className='size-9 rounded-md' />
      ))}
    </div>
    <SkeletonBar className='h-9 w-[5.75rem] rounded-md sm:w-20' />
  </div>
);

const TableSkeleton = ({
  totalRows = DEFAULT_PAGE_SIZE,
}: {
  totalRows?: number;
}) => (
  <>
    <div className='border-b border-[#27156F]/10 bg-gray-50/80 px-4 py-2.5'>
      <SkeletonBar className='h-4 w-52' />
    </div>
    <Table className='min-w-[800px]'>
      <TableHead>
        <TableRow className='hover:bg-transparent border-b border-[#27156F]/10'>
          {APPLICANT_TABLE_HEADERS.map((header) => (
            <TableHeader
              key={header}
              align={
                header === "Status" || header === "Review" ? "center" : "left"
              }
            >
              {header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: totalRows }).map((_, rowIdx) => (
          <ApplicantRowSkeleton key={rowIdx} />
        ))}
      </TableBody>
    </Table>
  </>
);

const StatsSkeleton = () => (
  <div className='mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
    {STAT_ITEMS.map((item) => (
      <div
        key={item.key}
        className='flex animate-pulse items-start gap-3 rounded-2xl border border-[#27156F]/10 bg-white p-4'
      >
        <div className='size-10 rounded-xl bg-gray-200' />
        <div className='flex-1 space-y-2'>
          <div className='h-7 w-12 rounded bg-gray-200' />
          <div className='h-3 w-16 rounded bg-gray-100' />
        </div>
      </div>
    ))}
  </div>
);

function CohortPreviewHeader({ cohortName }: { cohortName?: string }) {
  return (
    <header className='mb-6 sm:mb-8'>
      <nav aria-label='Breadcrumb'>
        <ol className='flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm leading-snug sm:text-base'>
          <li className='shrink-0'>
            <Link
              href='/admin/cohorts'
              className='font-medium text-gray-500 transition-colors hover:text-[#27156F]'
            >
              Cohorts
            </Link>
          </li>
          <li aria-hidden='true' className='shrink-0 text-gray-300'>
            /
          </li>
          <li className='min-w-0 flex-1'>
            {cohortName ? (
              <span
                className='font-medium opacity-90 text-[#27156F] line-clamp-2 sm:line-clamp-3'
                aria-current='page'
              >
                {cohortName}
              </span>
            ) : (
              <span
                className='block h-6 w-full max-w-lg animate-pulse rounded-md bg-gray-100'
                aria-hidden
              />
            )}
          </li>
        </ol>
      </nav>
    </header>
  );
}

interface ApiResponse {
  success: boolean;
  cohort: {
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    applicationStartDate?: string;
    applicationEndDate?: string;
    active?: boolean;
  };
  data: EnrollmentsType;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const CohortPreview = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug as string;

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [location, setLocation] = useState(
    searchParams.get("location") ?? "all",
  );
  const [course, setCourse] = useState(searchParams.get("course") ?? "all");
  const [pageSize, setPageSize] = useState(() =>
    parsePageSize(searchParams.get("limit")),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navToLastOnLoad, setNavToLastOnLoad] = useState(false);
  const [isCrossPageNav, setIsCrossPageNav] = useState(false);
  const [stickyEnrollment, setStickyEnrollment] =
    useState<EnrollmentType | null>(null);
  const queryClient = useQueryClient();

  const queryParams = {
    search: debouncedSearchTerm,
    status: status !== "all" ? status : "",
    location: location !== "all" ? location : "",
    course: course !== "all" ? course : "",
    page: String(page),
    limit: String(pageSize),
  };
  const queryString = Object.entries(queryParams)
    .filter((entry) => entry[1])
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data: cohortDetails, isLoading: cohortDetailsLoading } =
    useQuery<CohortType>({
      queryKey: ["cohort", slug],
      queryFn: async () => {
        const res = await fetch(`/api/cohorts/${slug}`);
        if (!res.ok) throw new Error("Cohort not found");
        return res.json();
      },
      enabled: !!slug,
    });

  const { data, isLoading, isFetching } = useQuery<ApiResponse, Error>({
    queryKey: [
      "cohort-applicants",
      slug,
      debouncedSearchTerm,
      status,
      location,
      course,
      page,
      pageSize,
    ],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      const res = await fetch(`/api/cohorts/${slug}/applicants?${queryString}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery<
    { stats: Record<string, number> },
    Error
  >({
    queryKey: ["cohort-applicants-stats", slug],
    queryFn: async () => {
      const res = await fetch(`/api/cohorts/${slug}/applicants/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();
    if (debouncedSearchTerm) urlParams.set("search", debouncedSearchTerm);
    if (status && status !== "all") urlParams.set("status", status);
    if (location && location !== "all") urlParams.set("location", location);
    if (course && course !== "all") urlParams.set("course", course);
    if (page > 1) urlParams.set("page", String(page));
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      urlParams.set("limit", String(pageSize));
    }
    router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
  }, [
    debouncedSearchTerm,
    status,
    location,
    course,
    page,
    pageSize,
    pathname,
    router,
  ]);

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const filteredEnrollments = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalApplicants = data?.pagination?.total ?? filteredEnrollments.length;
  const globalPosition = navToLastOnLoad
    ? Math.min(page * pageSize, totalApplicants)
    : (page - 1) * pageSize + currentIndex + 1;
  const canGoPrev = page > 1 || currentIndex > 0;
  const canGoNext =
    page < totalPages || currentIndex < filteredEnrollments.length - 1;
  const isModalNavigating = navToLastOnLoad || isCrossPageNav;
  const currentEnrollment = filteredEnrollments[currentIndex] ?? null;
  const modalEnrollment = isModalNavigating
    ? stickyEnrollment
    : currentEnrollment;

  const fetchApplicantsPage = async (targetPage: number) => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (status !== "all") params.set("status", status);
    if (location !== "all") params.set("location", location);
    if (course !== "all") params.set("course", course);
    params.set("page", String(targetPage));
    params.set("limit", String(pageSize));
    const res = await fetch(`/api/cohorts/${slug}/applicants?${params}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json() as Promise<ApiResponse>;
  };

  useEffect(() => {
    if (!isModalNavigating && currentEnrollment) {
      setStickyEnrollment(currentEnrollment);
    }
  }, [isModalNavigating, currentEnrollment]);

  useEffect(() => {
    if (!modalOpen) {
      setStickyEnrollment(null);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!isCrossPageNav && !navToLastOnLoad) return;
    if (isFetching) return;

    if (navToLastOnLoad && filteredEnrollments.length > 0) {
      setCurrentIndex(filteredEnrollments.length - 1);
      setNavToLastOnLoad(false);
    }
    setIsCrossPageNav(false);
  }, [isCrossPageNav, navToLastOnLoad, isFetching, filteredEnrollments.length]);

  useEffect(() => {
    setModalOpen(false);
    setCurrentIndex(0);
    setNavToLastOnLoad(false);
    setIsCrossPageNav(false);
    setStickyEnrollment(null);
  }, [debouncedSearchTerm, status, location, course, pageSize]);

  useEffect(() => {
    if (!modalOpen || !slug) return;

    const prefetchPage = async (targetPage: number) => {
      if (targetPage < 1 || targetPage > totalPages) return;
      await queryClient.prefetchQuery({
        queryKey: [
          "cohort-applicants",
          slug,
          debouncedSearchTerm,
          status,
          location,
          course,
          pageSize,
          targetPage,
        ],
        queryFn: () => fetchApplicantsPage(targetPage),
      });
    };

    if (currentIndex >= filteredEnrollments.length - 2 && page < totalPages) {
      void prefetchPage(page + 1);
    }

    if (currentIndex <= 1 && page > 1) {
      void prefetchPage(page - 1);
    }
  }, [
    modalOpen,
    currentIndex,
    page,
    totalPages,
    slug,
    debouncedSearchTerm,
    status,
    location,
    course,
    pageSize,
    filteredEnrollments.length,
    queryClient,
  ]);

  const handleRowClick = (idx: number) => {
    const enrollment = filteredEnrollments[idx];
    setCurrentIndex(idx);
    setStickyEnrollment(enrollment ?? null);
    setNavToLastOnLoad(false);
    setIsCrossPageNav(false);
    setModalOpen(true);
  };

  const handlePageChange = (nextPage: number) => {
    setModalOpen(false);
    setCurrentIndex(0);
    setNavToLastOnLoad(false);
    setIsCrossPageNav(false);
    setStickyEnrollment(null);
    setPage(nextPage);
  };

  const handleNavigate = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentIndex < filteredEnrollments.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (page < totalPages) {
        const leaving = filteredEnrollments[currentIndex];
        if (leaving) setStickyEnrollment(leaving);
        setIsCrossPageNav(true);
        setPage(page + 1);
        setCurrentIndex(0);
      }
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (page > 1) {
      const leaving = filteredEnrollments[currentIndex];
      if (leaving) setStickyEnrollment(leaving);
      setIsCrossPageNav(true);
      setNavToLastOnLoad(true);
      setPage(page - 1);
    }
  };

  const handleDownload = () => {
    const downloadParams = new URLSearchParams();
    if (searchTerm) downloadParams.set("search", searchTerm);
    if (status && status !== "all") downloadParams.set("status", status);
    if (location && location !== "all")
      downloadParams.set("location", location);
    if (course && course !== "all") downloadParams.set("course", course);
    downloadParams.set("download", "1");
    window.open(
      `/api/cohorts/${slug}/applicants?${downloadParams.toString()}`,
      "_blank",
    );
  };

  if (!isLoading && !cohortDetailsLoading && (!data || !slug)) {
    notFound();
  }

  const cohortName = cohortDetails?.name || data?.cohort?.name;
  const cohortCourses = getCohortCourses(cohortDetails?.courses);
  const hasFilters =
    !!searchTerm || status !== "all" || location !== "all" || course !== "all";

  const showTable = !isLoading && filteredEnrollments.length > 0;
  const showEmptyState = !isLoading && filteredEnrollments.length === 0;

  return (
    <>
      <CohortPreviewHeader cohortName={cohortName} />

      {statsLoading ? (
        <StatsSkeleton />
      ) : statsData?.stats ? (
        <div className='mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
          {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
            <div
              key={key}
              className='flex items-start gap-3 rounded-2xl border border-[#27156F]/10 bg-white p-4 shadow-sm'
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  bg,
                )}
              >
                <Icon className={cn("size-5", color)} />
              </div>
              <div>
                <p className={cn("text-2xl font-bold tabular-nums", color)}>
                  {statsData.stats[key] ?? 0}
                </p>
                <p className='text-xs text-gray-500'>{label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <CohortDetailsTable
        cohort={cohortDetails ?? data?.cohort}
        isLoading={cohortDetailsLoading && !cohortDetails}
      />

      <section className='space-y-4'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-lg font-bold text-[#27156F]'>Applicants</h2>
          {!isLoading && data?.pagination?.total !== undefined && (
            <span className='text-sm text-gray-500'>
              {data.pagination.total} total
            </span>
          )}
        </div>

        <TableContainer>
          <div className='flex flex-col gap-4 border-b border-[#27156F]/10 bg-[#DBEAF6]/20 p-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='relative w-full lg:max-w-md'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
              <Input
                type='search'
                placeholder='Search by name, email, or phone...'
                value={searchTerm}
                onChange={handleSearchTerm}
                className='border-[#27156F]/15 bg-white pl-9'
                disabled={isLoading}
              />
            </div>
            <div className='grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-2'>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className='w-full border-[#27156F]/15 bg-white sm:min-w-[130px] sm:w-auto'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem value={s} key={s} className='capitalize'>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={location}
                onValueChange={(value) => {
                  setLocation(value);
                  setPage(1);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className='w-full border-[#27156F]/15 bg-white sm:min-w-[140px] sm:w-auto'>
                  <SelectValue placeholder='All Locations' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Locations</SelectItem>
                  {states.map((loc) => (
                    <SelectItem value={loc} key={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CohortCourseSelect
                value={course}
                onValueChange={(value) => {
                  setCourse(value);
                  setPage(1);
                }}
                disabled={isLoading || cohortCourses.length === 0}
                placeholder='All Courses'
                allOption={{ value: "all", label: "All Courses" }}
                options={cohortCourses.map((c) => ({
                  value: String(c._id),
                  label: c.title,
                }))}
              />
              <Button
                variant='outline'
                className='w-full gap-2 border-[#27156F]/20 bg-white sm:w-auto'
                onClick={handleDownload}
                disabled={isLoading || filteredEnrollments.length === 0}
              >
                <Download className='size-4' />
                Download
              </Button>
            </div>
          </div>

          {showTable && (
            <>
              <div className='border-b border-[#27156F]/10 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-600'>
                Showing {filteredEnrollments.length} of{" "}
                {data?.pagination?.total ?? 0} applicants
                {hasFilters && (
                  <span className='ml-1 text-gray-500'>(filtered)</span>
                )}
              </div>
              <Table className='min-w-[800px]'>
                <TableHead>
                  <TableRow className='hover:bg-transparent border-b border-[#27156F]/10'>
                    {APPLICANT_TABLE_HEADERS.map((header) => (
                      <TableHeader
                        key={header}
                        align={
                          header === "Status" || header === "Review"
                            ? "center"
                            : "left"
                        }
                      >
                        {header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEnrollments.map((enrollment, idx) => (
                    <ApplicantTr
                      key={enrollment._id}
                      enrollment={enrollment}
                      onInfoClick={() => handleRowClick(idx)}
                      showCourse={false}
                    />
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {isLoading && <TableSkeleton totalRows={pageSize} />}

          {(showTable || isLoading) && (
            <div className='border-t border-[#27156F]/10 px-4 py-3'>
              <div className='flex flex-col items-center justify-between gap-3 sm:flex-row'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='whitespace-nowrap'>Show</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(parsePageSize(value));
                      setPage(1);
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className='h-9 w-[5.5rem] border-[#27156F]/15 bg-white'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className='whitespace-nowrap'>per page</span>
                </div>
                {isLoading ? (
                  <PaginationSkeleton />
                ) : (
                  totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {showEmptyState && (
            <EmptyState
              className='min-h-[320px] border-0 shadow-none'
              title={
                hasFilters ? "No matching applicants" : "No applicants yet"
              }
              message={
                hasFilters
                  ? "Try adjusting your search or filters."
                  : "Applicants will appear here when they register for this cohort."
              }
              size='lg'
            />
          )}
        </TableContainer>
      </section>

      {modalOpen && modalEnrollment && (
        <ApplicantInfoModal
          isOpen={modalOpen}
          onOpenChange={setModalOpen}
          enrollment={modalEnrollment}
          globalPosition={globalPosition}
          totalApplicants={totalApplicants}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          isNavigating={isModalNavigating}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};
