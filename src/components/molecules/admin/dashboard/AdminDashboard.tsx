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
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";

type LocationStats = {
  state: string;
  male: number;
  female: number;
  total: number;
};

type GenderStats = {
  male: number;
  female: number;
  total: number;
};

type Cohort = {
  id: string;
  name: string;
};

interface DashboardStat {
  name: string;
  value: number;
  color?: string;
}

interface AdminDashboardProps {
  cohortsData: CohortType[];
}

const StatCard = ({ stat }: { stat: DashboardStat }) => (
  <div
    className={`p-6 bg-white rounded-lg shadow-md border border-gray-200 ${stat.color ? "bg-opacity-5" : ""}`}
  >
    <p className={`text-3xl font-bold ${stat.color || "text-gray-900"}`}>
      {stat.value}
    </p>
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
  const [selectedCohort, setSelectedCohort] = useState<string>("all");

  const { data: statsData, isFetching } = useQuery<{
    success: boolean;
    data: {
      locationStats: LocationStats[];
      genderStats: GenderStats;
      statusStats: Record<string, number>;
      levelStats: Record<string, number>;
      cohorts: Cohort[];
      totalApplications: number;
    };
  }>({
    queryKey: ["applications-stats", selectedCohort],
    queryFn: async () => {
      const res = await fetch(
        `/api/applications/stats?cohortId=${selectedCohort}`
      );
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  // Transform stats data for dashboard cards
  const dashboardStats: DashboardStat[] = statsData?.data
    ? [
        {
          name: "Total Applicants",
          value: statsData.data.totalApplications,
          color: "text-blue-600",
        },
        {
          name: "Total Pending",
          value: statsData.data.statusStats.pending || 0,
          color: "text-yellow-600",
        },
        {
          name: "Total Declined",
          value: statsData.data.statusStats.declined || 0,
          color: "text-red-600",
        },
        {
          name: "Total Admitted",
          value: statsData.data.statusStats.admitted || 0,
          color: "text-green-600",
        },
        {
          name: "Total Graduated",
          value: statsData.data.statusStats.graduated || 0,
          color: "text-purple-600",
        },
      ]
    : [];

  const firstFiveCohorts = localCohorts.slice(0, 5);

  const checkAllCohortStatus = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <AdminSectionHeader
        title='Overview'
        cta={
          <>
            <Button
              onClick={checkAllCohortStatus}
              className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors'
            >
              <HiOutlinePlusCircle /> Create Cohort
            </Button>
            <Button
              variant='outline'
              asChild
              className='flex items-center gap-2 transition-colors'
            >
              <Link href='/enroll' target='_blank'>
                <ExternalLink />
                Go to Enroll Portal
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats cards */}
      {!statsData ? (
        <StatsSkeleton />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Application stats chart */}
      <section className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Application Statistics
        </h2>
        <ApplicationStatsChart
          data={statsData?.data}
          selectedCohort={selectedCohort}
          onCohortChange={setSelectedCohort}
          isFetching={isFetching}
        />
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
        />
      )}
    </>
  );
};
