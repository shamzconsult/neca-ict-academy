"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "lucide-react";
import { FaSearch } from "react-icons/fa";

import { levelOptions, statusOptions } from "@/const";
import { EnrollmentType } from "@/types";
import {
  Table,
  TableBody,
  TableContainer,
  TableEmptyRow,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atom/Table/Table";

import { Pagination } from "@/components/atom/Pagination";
import { ApplicantTr } from "./applicant-tr";
import { ApplicantInfoModal } from "./applicant-info-modal";

const LIMIT = 8;

const APPLICANT_HEADERS = [
  "Name",
  "Email",
  "Phone Number",
  "State",
  "Course",
  "Level",
  "Status",
  "Review",
] as const;

const ApplicantPreviewForm = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [level, setLevel] = useState(searchParams.get("level") ?? "all");

  const queryParams = {
    search: debouncedSearchTerm,
    status: status !== "all" ? status : "",
    level: level !== "all" ? level : "",
    page: String(page),
    limit: String(LIMIT),
  };
  const queryString = Object.entries(queryParams)
    .filter((entry) => entry[1])
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const { data, isLoading } = useQuery<
    { data: EnrollmentType[]; pagination: { totalPages: number } },
    Error
  >({
    queryKey: [
      "cohort-applicants",
      slug,
      debouncedSearchTerm,
      status,
      level,
      page,
    ],
    queryFn: async () => {
      if (!slug) return { data: [], pagination: { totalPages: 1 } };
      const res = await fetch(`/api/cohorts/${slug}/applicants?${queryString}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    enabled: !!slug,
  });

  const filteredApplicants = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setStatus(value);
    setPage(1);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setLevel(value);
    setPage(1);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRowClick = (idx: number) => {
    setCurrentIndex(idx);
    setModalOpen(true);
  };

  return (
    <section>
      <div className="px-4 space-y-8 w-full pb-10">
        <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4 rounded-xl border border-[#27156F]/10">
          <h1 className="md:text-[20px] font-semibold text-[#27156F]">
            All Applicants
          </h1>
        </div>
        <TableContainer>
          <div className="flex flex-col items-start md:flex-row justify-between md:items-center gap-4 p-4 border-b border-[#27156F]/10">
            <div className="relative w-full md:w-[70%]">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border w-full border-[#27156F]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27156F]/20 focus:border-[#27156F]/30"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={handleStatusChange}
                className="flex items-center px-3 py-2 border border-[#27156F]/15 cursor-pointer rounded-lg capitalize text-sm"
              >
                <option value="all">All Status</option>
                {statusOptions.map((statusOption, index) => (
                  <option value={statusOption} className="capitalize" key={index}>
                    {statusOption}
                  </option>
                ))}
              </select>

              <select
                value={level}
                onChange={handleLevelChange}
                className="flex items-center px-3 py-2 border border-[#27156F]/15 cursor-pointer rounded-lg capitalize text-sm"
              >
                <option value="all">All Level</option>
                {levelOptions.map((levelOption, index) => (
                  <option value={levelOption} className="capitalize" key={index}>
                    {levelOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader className="animate-spin text-[#E02B20] size-8" />
            </div>
          ) : (
            <>
              <Table className="min-w-[1100px]">
                <TableHead>
                  <TableRow className="hover:bg-transparent border-b border-[#27156F]/10">
                    {APPLICANT_HEADERS.map((header) => (
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
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant, idx) => (
                      <ApplicantTr
                        key={applicant._id}
                        enrollment={applicant}
                        onInfoClick={() => handleRowClick(idx)}
                      />
                    ))
                  ) : (
                    <TableEmptyRow colSpan={APPLICANT_HEADERS.length} />
                  )}
                </TableBody>
              </Table>
              <div className="border-t border-[#27156F]/10 px-4 py-3">
                <Pagination
                  currentPage={page}
                  onPageChange={setPage}
                  totalPages={totalPages}
                />
              </div>
            </>
          )}
        </TableContainer>
      </div>
      <ApplicantInfoModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        enrollment={filteredApplicants[currentIndex]}
        currentIndex={currentIndex}
        totalEnrollments={filteredApplicants.length}
        onNavigate={(direction) => {
          if (
            direction === "next" &&
            currentIndex < filteredApplicants.length - 1
          ) {
            setCurrentIndex(currentIndex + 1);
          } else if (direction === "prev" && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        }}
      />
    </section>
  );
};

export default ApplicantPreviewForm;
