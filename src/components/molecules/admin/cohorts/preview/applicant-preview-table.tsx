'use client';

import { useState } from 'react';

import { levelOptions, statusOptions } from '@/const';
import { ApplicantDetail } from '@/types';
import ApplicantTable from '@/components/atom/Table/ApplicantTable';
import { FaSearch } from 'react-icons/fa';

const ApplicantPreviewForm = ({ tableData }: { tableData: ApplicantDetail[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [level, setLevel] = useState('all');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel);
  };

  let filteredApplicants = tableData;

  if (searchTerm) {
    filteredApplicants = filteredApplicants.filter(applicant => {
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
    filteredApplicants = filteredApplicants.filter(applicant => applicant.status === status);
  }

  if (level !== 'all') {
    filteredApplicants = filteredApplicants.filter(applicant => applicant.level === level);
  }

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
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border w-full border-[#C4C4C4] rounded-md focus:outline-none focus:ring-none focus:border-gray-400'
              />
            </div>
            <div className='flex gap-2'>
              <select
                value={status}
                onChange={handleStatusChange}
                className='flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md capitalize'>
                <option value='all'>All Status</option>
                {statusOptions.map((status, index) => (
                  <option
                    value={status}
                    className='capitalize'
                    key={index}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={level}
                onChange={handleLevelChange}
                className='flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md capitalize'>
                <option value='all'>All Level</option>
                {levelOptions.map((level, index) => (
                  <option
                    value={level}
                    className='capitalize'
                    key={index}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ApplicantTable
            tableData={filteredApplicants}
            status={status}
            level={level}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </section>
  );
};

export default ApplicantPreviewForm;
