"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApplicationStatsChart } from "./ApplicationStatsChart";
import { CohortForm } from "@/components/atom/CohortForm";
import Link from "next/link";
import EmptyState from "@/components/atom/EmptyState";
import CohortTable from "@/components/atom/Table/CohortTable";
import { adminCohortTableHead } from "@/const";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  Users,
  XCircle,
} from "lucide-react";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";
import { PageLoader } from "@/components/atom/PageLoader";
import {
  useAdminCohorts,
  useSetAdminCohortsCache,
} from "@/hooks/useAdminCohorts";
import { cn } from "@/lib/utils";

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

type RecentActivity = {
  count: number;
  cohortName: string;
  cohortSlug: string;
};

interface DashboardStat {
  name: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  iconBg: string;
  iconColor: string;
}

const STAT_CONFIG = [
  {
    name: "Total Applicants",
    key: "totalApplications" as const,
    icon: Users,
    accent: "border-l-[#27156F]",
    iconBg: "bg-[#27156F]/10",
    iconColor: "text-[#27156F]",
  },
  {
    name: "Total Pending",
    key: "pending" as const,
    icon: Clock,
    accent: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    name: "Total Declined",
    key: "declined" as const,
    icon: XCircle,
    accent: "border-l-[#E02B20]",
    iconBg: "bg-red-50",
    iconColor: "text-[#E02B20]",
  },
  {
    name: "Total Admitted",
    key: "admitted" as const,
    icon: CheckCircle2,
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    name: "Total Graduated",
    key: "graduated" as const,
    icon: GraduationCap,
    accent: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
] as const;

const StatCard = ({ stat }: { stat: DashboardStat }) => {
  const Icon = stat.icon;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-[#27156F]/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md border-l-4 sm:gap-4 sm:p-5",
        stat.accent,
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          stat.iconBg,
        )}
      >
        <Icon className={cn("size-5", stat.iconColor)} />
      </div>
      <div className='min-w-0'>
        <p className='text-2xl font-bold tabular-nums text-[#27156F] sm:text-3xl'>
          {stat.value.toLocaleString()}
        </p>
        <p className='mt-0.5 text-sm text-gray-500'>{stat.name}</p>
      </div>
    </div>
  );
};

const formatRecentCount = (count: number) =>
  count >= 100 ? "100+" : count.toLocaleString();

const RecentActivityBanner = ({ activity }: { activity: RecentActivity[] }) => {
  const top = activity[0];
  if (!top) return null;

  const others = activity.slice(1);

  return (
    <div className='mb-8 flex items-start gap-3 rounded-xl border border-[#27156F]/10 bg-[#DBEAF6]/30 px-4 py-3 sm:items-center'>
      <span className='relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#27156F]/10 sm:mt-0'>
        <Clock className='size-4 text-[#27156F]' />
        <span className='absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#E02B20] animate-pulse' />
      </span>
      <div className='min-w-0 text-sm text-[#27156F]'>
        <p>
          <span className='font-bold tabular-nums'>
            {formatRecentCount(top.count)}
          </span>{" "}
          applicant{top.count === 1 ? "" : "s"} applied for{" "}
          <Link
            href={`/admin/cohorts/${top.cohortSlug}`}
            className='font-semibold underline decoration-[#27156F]/30 underline-offset-2 hover:text-[#E02B20]'
          >
            {top.cohortName}
          </Link>{" "}
          today
        </p>
        {others.length > 0 ? (
          <p className='mt-1 text-xs text-[#27156F]/70'>
            {others.map((item, index) => (
              <span key={item.cohortSlug}>
                {index > 0 ? ", " : ""}
                {formatRecentCount(item.count)} in{" "}
                <Link
                  href={`/admin/cohorts/${item.cohortSlug}`}
                  className='font-medium underline decoration-[#27156F]/20 underline-offset-2 hover:text-[#E02B20]'
                >
                  {item.cohortName}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const DashboardSection = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className='mb-8'>
    <div className='mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
      <h2 className='text-lg font-bold text-[#27156F] sm:text-xl'>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

export const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const setCohortsData = useSetAdminCohortsCache();
  const {
    data: cohorts = [],
    isPending: cohortsPending,
  } = useAdminCohorts();

  const {
    data: statsData,
    isPending: statsPending,
    isFetching,
  } = useQuery<{
    success: boolean;
    data: {
      locationStats: LocationStats[];
      genderStats: GenderStats;
      statusStats: Record<string, number>;
      levelStats: Record<string, number>;
      cohorts: Cohort[];
      totalApplications: number;
      recentActivity: RecentActivity[];
    };
  }>({
    queryKey: ["applications-stats", selectedCohort],
    queryFn: async () => {
      const res = await fetch(
        `/api/applications/stats?cohortId=${selectedCohort}`,
      );
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const statsInitialLoad = statsPending && !statsData;

  const dashboardStats: DashboardStat[] = statsData?.data
    ? STAT_CONFIG.map((config) => ({
        name: config.name,
        value:
          config.key === "totalApplications"
            ? statsData.data.totalApplications
            : statsData.data.statusStats[config.key] || 0,
        icon: config.icon,
        accent: config.accent,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
      }))
    : [];

  const firstFiveCohorts = cohorts.slice(0, 5);

  const toggleModal = () => setShowModal((prev) => !prev);

  if (cohortsPending || statsInitialLoad) {
    return <PageLoader className='bg-gray-50' />;
  }

  return (
    <>
      <AdminSectionHeader
        title='Overview'
        icon={LayoutDashboard}
        cta={
          <>
            <Button
              onClick={toggleModal}
              className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
            >
              <PlusCircle className='size-4' />
              Create Cohort
            </Button>
            <Button
              variant='outline'
              asChild
              className='gap-2 border-[#27156F]/20'
            >
              <Link href='/enroll' target='_blank'>
                <ExternalLink className='size-4' />
                Go to Enroll Portal
              </Link>
            </Button>
          </>
        }
      />

      {statsData ? (
        <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5'>
          {dashboardStats.map((stat) => (
            <StatCard key={stat.name} stat={stat} />
          ))}
        </div>
      ) : null}

      {statsData?.data.recentActivity?.length ? (
        <RecentActivityBanner activity={statsData.data.recentActivity} />
      ) : null}

      <DashboardSection title='Application Statistics'>
        <ApplicationStatsChart
          data={statsData?.data}
          selectedCohort={selectedCohort}
          onCohortChange={setSelectedCohort}
          isFetching={isFetching}
        />
      </DashboardSection>

      <DashboardSection
        title='Recent Cohorts'
        action={
          <Link
            href='/admin/cohorts'
            className='inline-flex items-center gap-1 text-sm font-semibold text-[#27156F] transition-colors hover:text-[#E02B20]'
          >
            View all
            <ArrowRight className='size-4' />
          </Link>
        }
      >
        {cohorts.length > 0 ? (
          <CohortTable
            tableHead={adminCohortTableHead}
            tableData={firstFiveCohorts}
            action={false}
          />
        ) : (
          <EmptyState
            title='No cohort created yet'
            message='Click Create Cohort to get started'
          />
        )}
      </DashboardSection>

      {showModal && (
        <CohortForm
          toggleModal={toggleModal}
          setCohortsData={setCohortsData}
        />
      )}
    </>
  );
};
