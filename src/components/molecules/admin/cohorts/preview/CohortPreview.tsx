'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import EmptyState from '@/components/atom/EmptyState';
import { EnrollmentsType } from '@/types';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineArrowCircleDown } from 'react-icons/md';

import { statusOptions } from '@/const';
import { ApplicantTr } from './applicant-tr';
import { Table, TableBody, TableHead, TableRow } from '@/components/atom/Table/Table';

export const CohortPreview = ({ enrollments }: { enrollments: EnrollmentsType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };

  const cohort = enrollments[0]?.cohort;
  let filteredEnrollment = enrollments || [];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${cohort.name} - Applicants List`, 14, 15);
    doc.setFontSize(12);

    const tableData = filteredEnrollment.map(({ level, course, applicant, createdAt }) => [
      `${applicant.firstName} ${applicant.lastName}\n${applicant.email}`,
      applicant.state,
      course.title,
      level,
      status,
      new Date(createdAt).toDateString(),
    ]);

    autoTable(doc, {
      head: [['Applicants', 'Location', 'Course', 'Level', 'Status', 'Date']],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [33, 33, 33],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },
    });

    doc.save(`${cohort.name}-applicants.pdf`);
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

  if (searchTerm) {
    filteredEnrollment = filteredEnrollment.filter(({ applicant }) => {
      return (
        applicant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  if (status !== 'all') {
    filteredEnrollment = filteredEnrollment.filter(({ applicant }) => applicant.status === status);
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
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border w-full border-[#C4C4C4] rounded-md focus:outline-none focus:ring-none focus:border-gray-400'
              />
            </div>

            <div className='flex gap-2'>
              <select
                value={status}
                onChange={handleStatusChange}
                className='flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md'>
                <option value='all'>All Status</option>
                {statusOptions.map((status, index) => (
                  <option
                    value={status}
                    key={index}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                className='flex items-center gap-2 px-4 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md'
                onClick={handleDownloadPDF}>
                <MdOutlineArrowCircleDown />
                Download Data
              </button>
            </div>
          </div>
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
                {filteredEnrollment.length > 0 ? (
                  filteredEnrollment.map(enrollment => (
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
          </div>
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
