"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { AlertTriangle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChartSkeleton } from "./ChartSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

export const ApplicationStatsChart = ({
  data,
  selectedCohort,
  onCohortChange,
  isFetching,
  error,
}: ApplicationStatsChartProps) => {
  const [chartType, setChartType] = useState<"location" | "gender">("location");

  // Use location data in the original order from states constant
  const locationData = data?.locationStats || [];

  const locationChartData = {
    labels: locationData.map((d: LocationStats) => d.state),
    datasets: [
      {
        label: "Male",
        data: locationData.map((d: LocationStats) => d.male),
        backgroundColor: "#3b82f6",
        stack: "stack0",
      },
      {
        label: "Female",
        data: locationData.map((d: LocationStats) => d.female),
        backgroundColor: "#ec4899",
        stack: "stack0",
      },
    ],
  };

  const genderChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [data?.genderStats?.male || 0, data?.genderStats?.female || 0],
        backgroundColor: ["#3b82f6", "#ec4899"],
      },
    ],
  };

  const locationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          footer: (items: any[]) => {
            const total = items.reduce((sum, item) => sum + item.raw, 0);
            return `Total: ${total}`;
          },
        },
      },
      title: {
        display: true,
        text: `Applications by Location${selectedCohort !== "all" ? ` - ${data?.cohorts?.find((c) => c.id === selectedCohort)?.name}` : ""}`,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        title: {
          display: true,
          text: "Number of Applications",
        },
      },
    },
  };

  const genderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: `Applications by Gender${selectedCohort !== "all" ? ` - ${data?.cohorts?.find((c) => c.id === selectedCohort)?.name}` : ""}`,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
  };

  return (
    <div className='w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200'>
      <div className='flex justify-between mb-4'>
        <div className='flex gap-4'>
          <Select value={selectedCohort} onValueChange={onCohortChange}>
            <SelectTrigger className='w-[200px]'>
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
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select chart type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='location'>By Location</SelectItem>
              <SelectItem value='gender'>By Gender</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm text-gray-600'>
          Total Applications: {data?.totalApplications || 0}
        </div>
      </div>
      <div className='relative h-[400px]'>
        {error ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 text-red-500'>
            <AlertTriangle className='w-8 h-8' />
            <p>Failed to load data</p>
            <p className='text-sm text-gray-500'>{error.message}</p>
          </div>
        ) : isFetching ? (
          <ChartSkeleton />
        ) : !data?.locationStats?.length ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 text-gray-500'>
            <Search className='w-8 h-8' />
            <p>No application data available</p>
            <p className='text-sm'>
              There are no applications with data to display
            </p>
          </div>
        ) : chartType === "location" ? (
          <Bar data={locationChartData} options={locationChartOptions} />
        ) : (
          <Pie data={genderChartData} options={genderChartOptions} />
        )}
      </div>
    </div>
  );
};
