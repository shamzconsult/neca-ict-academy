"use client";

import React, { useEffect, useState } from "react";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

import { FaSearch } from "react-icons/fa";
import { MdOutlineArrowCircleDown } from "react-icons/md";

import { pdfDownload } from "@/utils/pdf-download";

import { Table, TableBody, TableHead } from "@/components/atom/Table/Table";
import EmptyState from "@/components/atom/EmptyState";
import { ApplicantTr } from "./applicant-tr";
import { Pagination } from "@/components/atom/Pagination";
import { statusOptions } from "@/const";

import { EnrollmentsType } from "@/types";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LIMIT = 8;

const TableSkeleton = ({
  rows = 8,
  columns = 7,
}: {
  rows?: number;
  columns?: number;
}) => (
  <div className='overflow-x-auto'>
    <table className='w-full table-auto bg-white rounded-b-lg'>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, idx) => (
            <th key={idx} className='p-4 border-gray-200 bg-gray-50'>
              <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx} className='p-4 border-t border-gray-100'>
                <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatsSkeleton = () => (
  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6'>
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className='p-4 bg-gray-100 rounded shadow animate-pulse h-20'
      />
    ))}
  </div>
);

interface ApiResponse {
  success: boolean;
  cohort: {
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    status: string;
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
    searchParams.get("search") ?? ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");

  // Build query string for API
  const queryParams = {
    search: debouncedSearchTerm,
    status: status !== "all" ? status : "",
    page: String(page),
    limit: String(LIMIT),
  };
  const queryString = Object.entries(queryParams)
    .filter((entry) => entry[1])
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  // React Query fetch
  const { data, isLoading } = useQuery<ApiResponse, Error>({
    queryKey: ["cohort-applicants", slug, debouncedSearchTerm, status, page],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      const res = await fetch(`/api/cohort/${slug}/applicants?${queryString}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    enabled: !!slug,
  });

  // Fetch stats for this cohort
  const { data: statsData, isLoading: statsLoading } = useQuery<
    { stats: Record<string, number> },
    Error
  >({
    queryKey: ["cohort-applicants-stats", slug],
    queryFn: async () => {
      if (!slug)
        return {
          stats: {
            total: 0,
            admitted: 0,
            pending: 0,
            declined: 0,
            graduated: 0,
          },
        };
      const res = await fetch(`/api/cohort/${slug}/applicants/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!slug,
  });

  // Update router for deep-linking
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (status && status !== "all") params.set("status", status);
    if (page > 1) params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, status, page, pathname, router]);

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  if (!isLoading && (!data || !slug)) {
    notFound();
  }

  const cohortName = data?.cohort?.name;
  const filteredEnrollments = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const showSkeleton = isLoading;
  const showTable = !isLoading && filteredEnrollments.length > 0;
  const showEmptyState = !isLoading && filteredEnrollments.length === 0;

  return (
    <div className='p-6'>
      <div className='sticky top-0 z-10 bg-gray-50 pb-4 mb-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
          {isLoading ? (
            <div className='h-8 w-64 bg-gray-100 rounded animate-pulse' />
          ) : (
            cohortName
          )}
        </h1>
      </div>
      {/* Stats Bar */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : statsData && statsData.stats ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6'>
          <div className='p-4 bg-white rounded shadow border text-center'>
            <div className='text-xs text-gray-500 mb-1'>Total</div>
            <div className='text-2xl font-bold text-gray-800'>
              {statsData.stats.total}
            </div>
          </div>
          <div className='p-4 bg-white rounded shadow border text-center'>
            <div className='text-xs text-gray-500 mb-1'>Admitted</div>
            <div className='text-2xl font-bold text-green-600'>
              {statsData.stats.admitted}
            </div>
          </div>
          <div className='p-4 bg-white rounded shadow border text-center'>
            <div className='text-xs text-gray-500 mb-1'>Pending</div>
            <div className='text-2xl font-bold text-yellow-500'>
              {statsData.stats.pending}
            </div>
          </div>
          <div className='p-4 bg-white rounded shadow border text-center'>
            <div className='text-xs text-gray-500 mb-1'>Declined</div>
            <div className='text-2xl font-bold text-red-500'>
              {statsData.stats.declined}
            </div>
          </div>
          <div className='p-4 bg-white rounded shadow border text-center'>
            <div className='text-xs text-gray-500 mb-1'>Graduated</div>
            <div className='text-2xl font-bold text-blue-600'>
              {statsData.stats.graduated}
            </div>
          </div>
        </div>
      ) : null}
      <section className='border border-gray-200 rounded-lg bg-white shadow-sm w-full'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-t-lg'>
          <div className='relative w-full md:w-[70%]'>
            <FaSearch className='absolute left-3 top-3 text-gray-400' />
            <input
              type='text'
              placeholder='Search applicants...'
              value={searchTerm}
              onChange={handleSearchTerm}
              className='pl-10 pr-4 py-2 border w-full border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white'
            />
          </div>
          <div className='flex gap-2'>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className='min-w-[120px]'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                {statusOptions.map((status, index) => (
                  <SelectItem value={status} key={index} className='capitalize'>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className='border text-nowrap border-gray-200 cursor-pointer rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => pdfDownload(cohortName || "", filteredEnrollments)}
              disabled={isLoading || filteredEnrollments.length === 0}
            >
              <MdOutlineArrowCircleDown />
              Download Data
            </Button>
          </div>
        </div>
        {showTable && (
          <div className='overflow-x-auto'>
            <Table className='w-full table-auto bg-white rounded-lg overflow-hidden'>
              <TableHead>
                <tr className='border-b border-gray-200 bg-gray-50'>
                  {[
                    "Applicants",
                    "Location",
                    "Date",
                    "Course",
                    "Level",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className='p-4 text-left font-semibold text-gray-700'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </TableHead>
              <TableBody>
                {filteredEnrollments.length > 0 &&
                  filteredEnrollments.map((enrollment) => (
                    <ApplicantTr key={enrollment._id} enrollment={enrollment} />
                  ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
        {showSkeleton && <TableSkeleton />}
        {showEmptyState && (
          <EmptyState
            title={
              searchTerm && status !== "all"
                ? "No record found"
                : `No applicants yet in "${cohortName}"`
            }
            message={
              searchTerm && status !== "all"
                ? `No applicants match the search "${searchTerm}" and status "${status}"`
                : searchTerm
                  ? `No applicants match the search "${searchTerm}"`
                  : status !== "all"
                    ? `No applicants with status "${status}"`
                    : "Applicants will appear here when they register for this cohort"
            }
            size='lg'
          />
        )}
      </section>
    </div>
  );
};
