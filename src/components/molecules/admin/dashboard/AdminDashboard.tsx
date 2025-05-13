"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationStatsChart } from "./ApplicationStatsChart";
import { CohortType } from "@/types";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { CohortForm } from "@/components/atom/CohortForm";
import Link from "next/link";
import EmptyState from "@/components/atom/EmptyState";
import CohortTable from "@/components/atom/Table/CohortTable";
import { adminCohortTableHead } from "@/const";
import { toast } from "sonner";

interface DashboardStat {
  name: string;
  value: number;
}

interface AdminDashboardProps {
  cohortsData: CohortType[];
}

const StatCard = ({ stat }: { stat: DashboardStat }) => (
  <div className='p-6 bg-white rounded-lg shadow-md border border-gray-200'>
    <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
    <p className='text-sm text-gray-500'>{stat.name}</p>
  </div>
);

const StatsSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className='p-6 bg-white rounded-lg shadow-md border border-gray-200'
      >
        <div className='h-8 w-16 bg-gray-200 rounded animate-pulse mb-2' />
        <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
      </div>
    ))}
  </div>
);

export const AdminDashboard = ({ cohortsData }: AdminDashboardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [localCohorts, setLocalCohorts] = useState<CohortType[]>(
    cohortsData || []
  );

  const { data: dashboardStats, isLoading } = useQuery<{
    success: boolean;
    data: DashboardStat[];
  }>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
  });

  // Transform cohorts data for the chart
  const transformedCohortsData = localCohorts.map((cohort) => ({
    name: cohort.name,
    slug: cohort.slug,
    total: 0, // These will be populated by the chart's own data fetching
    male: 0,
    female: 0,
  }));

  const firstFiveCohorts = localCohorts.slice(0, 5);

  const checkAllCohortStatus = () => {
    setShowModal(!showModal);
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header with title and create button */}
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Overview</h1>
        <button
          onClick={checkAllCohortStatus}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </header>

      {/* Stats cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          {dashboardStats?.data.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Application stats chart */}
      <section className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Application Statistics
        </h2>
        <ApplicationStatsChart initialData={transformedCohortsData} />
      </section>

      {/* Cohorts table */}
      <section className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Cohorts</h2>
          <Link href='/admin/cohorts' className='text-blue-600 hover:underline'>
            View All Cohorts
          </Link>
        </div>
        <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
          {localCohorts?.length > 0 ? (
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

      {/* Cohort creation modal */}
      {showModal && (
        <CohortForm
          toggleModal={checkAllCohortStatus}
          setCohortsData={setLocalCohorts}
          cohortsData={localCohorts}
        />
      )}
    </div>
  );
};
