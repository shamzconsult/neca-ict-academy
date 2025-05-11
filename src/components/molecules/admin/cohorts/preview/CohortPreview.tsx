'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDebounce } from '../../../../../../hooks/useDebounce';

import { FaSearch } from 'react-icons/fa';
import { Loader } from 'lucide-react';
import { MdOutlineArrowCircleDown } from 'react-icons/md';

import { pdfDownload } from '@/utils/pdf-download';

import { Table, TableBody, TableHead, TableRow } from '@/components/atom/Table/Table';
import EmptyState from '@/components/atom/EmptyState';
import { ApplicantTr } from './applicant-tr';
import { Pagination } from '@/components/atom/Pagination';
import { statusOptions } from '@/const';

import { EnrollmentsType } from '@/types';

const LIMIT = 8;

export const CohortPreview = ({ enrollments }: { enrollments: EnrollmentsType }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState(searchParams.get('status') ?? 'all');

  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentsType>(enrollments);

  const cohort = enrollments[0]?.cohort;
  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      console.log(Object.entries(updates));
      console.log('params', params, updates);
      Object.entries(updates).forEach(([name, value]) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          search: debouncedSearchTerm,
          status: status !== 'all' ? status : '',
          page: String(page),
          limit: String(LIMIT),
        };

        const queryString = createQueryString(queryParams);
        router.push(`${pathname}?${queryString}`, { scroll: false });

        const res = await fetch(`/api/cohort-applicants/?${queryString}`);
        const data = await res.json();

        setFilteredEnrollments(data.data);
        setTotalPages(data.pagination.totalPages);

        setLoading(false);

        if (page > data.pagination.totalPages && data.pagination.totalPages > 0) {
          setPage(data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, status, page, pathname, router, createQueryString]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    setPage(1);
  };

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  if (!cohort) {
    return (
      <div className=' h-screen mt2 flex flex-col justify-center items-center'>
        <h1 className='text-center font-bold  '>Cohort not found</h1>
        <Link
          className='text-sm text-slate-400 hover:underline cursor-pointer'
          href='/admin/cohorts'>
          Click here to check other Cohort
        </Link>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='md:text-[20px] font-semibold mb-6 p-3 bg-white w-full'>{cohort.name}</h1>
      {enrollments && enrollments.length > 0 ? (
        <section className='border border-[#C4C4C4] w-full'>
          <div className='flex flex-col items-start md:flex-row justify-between md:items-center gap-4 p-4 w-full'>
            <div className='relative w-full md:w-[70%]'>
              <FaSearch className='absolute left-3 top-3 ' />

              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={handleSearchTerm}
                className='pl-10 pr-4 py-2 border w-full border-[#C4C4C4] rounded-md focus:outline-none focus:ring-none focus:border-gray-400'
              />
            </div>

            <div className='flex gap-2'>
              <select
                value={status}
                onChange={handleStatusChange}
                className='flex items-center px-2 py-2 border capitalize text-nowrap border-[#C4C4C4] cursor-pointer rounded-md'>
                <option value='all'>All Status</option>
                {statusOptions.map((status, index) => (
                  <option
                    className='capitalize'
                    value={status}
                    key={index}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                className='flex items-center gap-2 px-4 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md'
                onClick={() => pdfDownload(cohort.name, filteredEnrollments)}>
                <MdOutlineArrowCircleDown />
                Download Data
              </button>
            </div>
          </div>
          {loading ? (
            <div>
              <Loader className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] animate-spin text-red-700 size-8' />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table className='w-full table-auto bg-white'>
                <TableHead>
                  <tr>
                    {['Applicants', 'Location', 'Date', 'Course', 'Level', 'Status', 'Action'].map(header => (
                      <th
                        key={header}
                        className='p-4 border-t border-[#C4C4C4] text-left font-medium'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map(enrollment => (
                      <ApplicantTr
                        key={enrollment._id}
                        enrollment={enrollment}
                      />
                    ))
                  ) : (
                    <TableRow className='border-t border-[#C4C4C4]'>
                      <td colSpan={7}>
                        <div className='text-center font-bold py-24'>
                          No results found for {searchTerm && <span className='text-red-500'>&#34;{searchTerm}&#34;</span>}
                          {status !== 'all' && (
                            <span className='text-red-500'>
                              {searchTerm ? ' and ' : ''}status &#34;{status}&#34;
                            </span>
                          )}
                        </div>
                      </td>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </section>
      ) : (
        <EmptyState
          title='No applicants found in this cohort'
          message='Check back later'
        />
      )}
    </div>
  );
};
