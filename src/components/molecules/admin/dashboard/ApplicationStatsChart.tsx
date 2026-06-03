"use client";

import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { AlertTriangle, BarChart3, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChartSkeleton } from "./ChartSkeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

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

type ApplicationStatsChartProps = {
  data?: {
    locationStats: LocationStats[];
    genderStats: GenderStats;
    statusStats: Record<string, number>;
    levelStats: Record<string, number>;
    cohorts: Cohort[];
    totalApplications: number;
  };
  selectedCohort: string;
  onCohortChange: (cohort: string) => void;
  isFetching: boolean;
  error?: Error;
};

const BRAND_MALE = "#27156F";
const BRAND_FEMALE = "#E02B20";
const LOCATION_BAR_WIDTH = 36;

export const ApplicationStatsChart = ({
  data,
  selectedCohort,
  onCohortChange,
  isFetching,
  error,
}: ApplicationStatsChartProps) => {
  const [chartType, setChartType] = useState<"location" | "gender">("location");
  const isMobile = useMediaQuery("(max-width: 639px)");

  const sortedLocationData = useMemo(() => {
    return (
      data?.locationStats?.slice().sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return a.state.localeCompare(b.state);
      }) ?? []
    );
  }, [data?.locationStats]);

  const locationChartWidth =
    sortedLocationData.length * LOCATION_BAR_WIDTH + 80;

  const cohortLabel =
    selectedCohort !== "all"
      ? data?.cohorts?.find((c) => c.id === selectedCohort)?.name
      : null;

  const locationChartData = {
    labels: sortedLocationData.map((d) => d.state),
    datasets: [
      {
        label: "Male",
        data: sortedLocationData.map((d) => d.male),
        backgroundColor: BRAND_MALE,
        borderRadius: 4,
        stack: "stack0",
      },
      {
        label: "Female",
        data: sortedLocationData.map((d) => d.female),
        backgroundColor: BRAND_FEMALE,
        borderRadius: 4,
        stack: "stack0",
      },
    ],
  };

  const genderChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [data?.genderStats?.male || 0, data?.genderStats?.female || 0],
        backgroundColor: [BRAND_MALE, BRAND_FEMALE],
        borderWidth: 0,
      },
    ],
  };

  const locationChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, padding: 16 },
      },
      tooltip: {
        callbacks: {
          footer: (items: TooltipItem<"bar">[]) => {
            const total = items.reduce(
              (sum, item) => sum + Number(item.raw ?? 0),
              0,
            );
            return `Total: ${total}`;
          },
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          maxRotation: isMobile ? 65 : 45,
          minRotation: isMobile ? 45 : 45,
          font: { size: isMobile ? 8 : 10 },
          autoSkip: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: "rgba(39, 21, 111, 0.06)" },
        ticks: { precision: 0 },
        title: {
          display: true,
          text: "Applications",
          color: "#6b7280",
          font: { size: 12 },
        },
      },
    },
  };

  const genderChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true, padding: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const value = Number(context.raw ?? 0);
            const datasetData = context.dataset.data as number[];
            const total = datasetData.reduce((a, b) => a + b, 0);
            const percentage = total
              ? ((value / total) * 100).toFixed(1)
              : "0";
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: { display: false },
    },
  };

  const hasApplicationData = (data?.totalApplications ?? 0) > 0;

  return (
    <div className='overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white shadow-sm'>
      <div className='flex flex-col gap-4 border-b border-[#27156F]/10 bg-[#DBEAF6]/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex size-9 items-center justify-center rounded-lg bg-white shadow-sm'>
            <BarChart3 className='size-4 text-[#27156F]' />
          </div>
          <div>
            <p className='font-semibold text-[#27156F]'>
              {chartType === "location"
                ? "Applications by Location"
                : "Applications by Gender"}
            </p>
            {cohortLabel && (
              <p className='text-xs text-gray-500 line-clamp-1'>
                {cohortLabel}
              </p>
            )}
          </div>
        </div>

        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3'>
          <Select value={selectedCohort} onValueChange={onCohortChange}>
            <SelectTrigger className='w-full border-[#27156F]/15 bg-white sm:w-[180px]'>
              <SelectValue placeholder='Select cohort' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Cohorts</SelectItem>
              {data?.cohorts?.map((cohort) => (
                <SelectItem key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={chartType}
            onValueChange={(value: "location" | "gender") =>
              setChartType(value)
            }
          >
            <SelectTrigger className='w-full border-[#27156F]/15 bg-white sm:w-[160px]'>
              <SelectValue placeholder='Chart type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='location'>By Location</SelectItem>
              <SelectItem value='gender'>By Gender</SelectItem>
            </SelectContent>
          </Select>
          {/* <Badge
            variant='outline'
            className='border-[#27156F]/20 bg-white px-3 py-2 text-[#27156F]'
          >
            Total: {data?.totalApplications?.toLocaleString() ?? 0}
          </Badge> */}
        </div>
      </div>

      <div className='relative h-[260px] p-3 sm:h-[340px] sm:p-5 lg:h-[380px]'>
        {error ? (
          <div className='flex h-full flex-col items-center justify-center gap-2 text-[#E02B20]'>
            <AlertTriangle className='size-8' />
            <p className='font-medium'>Failed to load data</p>
            <p className='text-sm text-gray-500'>{error.message}</p>
          </div>
        ) : isFetching ? (
          <ChartSkeleton />
        ) : !hasApplicationData ? (
          <div className='flex h-full flex-col items-center justify-center gap-2 text-gray-500'>
            <Search className='size-8 text-gray-300' />
            <p className='font-medium'>No application data yet</p>
            <p className='text-sm text-gray-400'>
              Data will appear when applicants register
            </p>
          </div>
        ) : chartType === "location" ? (
          <div className='h-full overflow-x-auto'>
            <div
              className='h-full'
              style={{ minWidth: locationChartWidth }}
            >
              <Bar data={locationChartData} options={locationChartOptions} />
            </div>
          </div>
        ) : (
          <div className='mx-auto flex h-full max-w-sm items-center justify-center'>
            <Pie data={genderChartData} options={genderChartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};
