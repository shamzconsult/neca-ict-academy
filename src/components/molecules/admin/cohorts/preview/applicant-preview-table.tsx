"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "lucide-react";
import { FaSearch } from "react-icons/fa";

import { levelOptions, statusOptions } from "@/const";
import { EnrollmentType } from "@/types";
import ApplicantTable from "@/components/atom/Table/ApplicantTable";

import { Pagination } from "@/components/atom/Pagination";
import { ApplicantTr } from "./applicant-tr";
import { ApplicantInfoModal } from "./applicant-info-modal";

const LIMIT = 8;

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

  // Build query string for API
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
    console.log("Row clicked:", idx);
    setCurrentIndex(idx);
    setModalOpen(true);
  };

  return (
    <section>
      <div className='px-4 space-y-8 w-full pb-10'>
        <div className='flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4'>
          <h1 className='md:text-[20px] font-medium'>All Applicants</h1>
        </div>
        <div className='border border-[#C4C4C4] w-full'>
          <div className='flex flex-col items-start md:flex-row justify-between md:items-center gap-4 p-4 w-full'>
            <div className='relative w-full md:w-[70%]'>
              <FaSearch className='absolute left-3 top-3 ' />

              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border w-full border-[#C4C4C4] rounded-md focus:outline-none focus:ring-none focus:border-gray-400'
              />
            </div>
            <div className='flex gap-2'>
              <select
                value={status}
                onChange={handleStatusChange}
                className='flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md capitalize'
              >
                <option value='all'>All Status</option>
                {statusOptions.map((status, index) => (
                  <option value={status} className='capitalize' key={index}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={level}
                onChange={handleLevelChange}
                className='flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md capitalize'
              >
                <option value='all'>All Level</option>
                {levelOptions.map((level, index) => (
                  <option value={level} className='capitalize' key={index}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <Loader className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] animate-spin text-red-700 size-8' />
          ) : (
            <>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-6 py-3'>Name</th>
                    <th className='px-6 py-3'>Email</th>
                    <th className='px-6 py-3'>Phone Number</th>
                    <th className='px-6 py-3'>State</th>
                    <th className='px-6 py-3'>Course</th>
                    <th className='px-6 py-3'>Level</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant, idx) => (
                      <ApplicantTr
                        key={applicant._id}
                        enrollment={applicant}
                        onInfoClick={() => handleRowClick(idx)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className='text-center text-red-500 font-bold py-24'
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
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
