"use client";

import { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { ApplicationStatsChart } from "./ApplicationStatsChart";
import { CohortForm } from "@/components/atom/CohortForm";
import Link from "next/link";
import { CohortType, DashboardStats } from "@/types";
import EmptyState from "@/components/atom/EmptyState";
import CohortTable from "@/components/atom/Table/CohortTable";
import { adminCohortTableHead } from "@/const";
import { toast } from "sonner";

export const AdminDashboard = ({
  cohortsData: initialCohorts,
  dashboardStats,
}: {
  cohortsData: CohortType[];
  dashboardStats: DashboardStats;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(
    initialCohorts || []
  );

  const firstFiveCohorts = cohortsData.slice(0, 5);

  const checkAllCohortStatus = () => {
    if (cohortsData.some((cohort) => cohort.active)) {
      toast.error("There is an active cohort");
    } else {
      setShowModal(!showModal);
    }
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
        <button
          onClick={checkAllCohortStatus}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
        {dashboardStats?.map((stat, index) => (
          <div
            key={index}
            className='p-6 bg-white rounded-lg shadow-md border border-gray-200'
          >
            <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
            <p className='text-sm text-gray-500'>{stat.name}</p>
          </div>
        ))}
      </div>

      <section className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Application Statistics
        </h2>
        <ApplicationStatsChart />
      </section>

      <section className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Cohorts</h2>
          <Link href='/admin/cohorts' className='text-blue-600 hover:underline'>
            View All Cohorts
          </Link>
        </div>
        <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
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
