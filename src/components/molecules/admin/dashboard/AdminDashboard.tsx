'use client';

import { useState } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { ApplicationStatsChart } from './ApplicationStatsChart';
import { CohortForm } from '@/components/atom/CohortForm';
import Link from 'next/link';
import { CohortType, DashboardStats } from '@/types';
import EmptyState from '@/components/atom/EmptyState';
import Swal from 'sweetalert2';
import CohortTable from '@/components/atom/Table/CohortTable';
import { adminCohortTableHead } from '@/const';

export const AdminDashboard = ({ cohortsData: initialCohorts, dashboardStats }: { cohortsData: CohortType[]; dashboardStats: DashboardStats }) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(initialCohorts || []);

  const firstFiveCohorts = cohortsData.slice(0, 5);
  console.log('cohortsData', cohortsData);

  const checkAllCohortStatus = () => {
    if (cohortsData.some(cohort => cohort.active)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'There is an active cohort',
        theme: 'dark',
      });
    } else {
      setShowModal(!showModal);
    }
  };

  return (
    <div className='md:px-4 space-y-8 w-full pb-10'>
      <div className='flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white'>
        <h1 className='md:text-[20px] font-medium'>Dashboard Overview</h1>
        <button
          onClick={checkAllCohortStatus}
          className='bg-[#E02B20] text-nowrap flex items-center gap-1 text-white px-6 py-2.5 rounded-md cursor-pointer'>
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        {dashboardStats?.map((stat, index) => (
          <div
            key={index}
            className='p-4 border border-[#C4C4C4] rounded-md bg-white'>
            <p className='md:text-[20px] font-semibold'>{stat.value}</p>
            <p className=''>{stat.name}</p>
          </div>
        ))}
      </div>
      <ApplicationStatsChart />

      <section className='w-full'>
        <div className='flex justify-between items-center py-3'>
          <h2 className='text-xl font-semibold'>Cohorts</h2>
          <Link
            href='/admin/cohorts'
            className='text-[#E02B20] hover:underline hover:underline-offset-8'>
            View All Cohorts
          </Link>
        </div>

        <div className='overflow-x-auto border border-[#C4C4C4]  '>
          {cohortsData?.length > 0 ? (
            <CohortTable
              tableHead={adminCohortTableHead}
              tableData={firstFiveCohorts}
              action={false}
            />
          ) : (
            <EmptyState
              title='No Cohort Created yet'
              message='Click on the create Cohort button to start'
            />
          )}
        </div>
      </section>

      {showModal && (
        <CohortForm
          toggleModal={checkAllCohortStatus}
          setCohortsData={setCohortsData}
          cohortsData={cohortsData}
        />
      )}
    </div>
  );
};
