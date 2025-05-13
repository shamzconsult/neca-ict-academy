"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AlertTriangle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CohortStats {
  name: string;
  slug: string;
  total: number;
  male: number;
  female: number;
}

interface ApplicationStatsChartProps {
  initialData?: CohortStats[];
}

const ChartSkeleton = () => (
  <div className='w-full h-full flex flex-col gap-4 p-4'>
    <div className='h-6 w-1/3 bg-gray-200 rounded animate-pulse' />
    <div className='flex-1 flex items-end gap-2'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='flex-1 bg-gray-200 rounded-t animate-pulse'
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

export const ApplicationStatsChart = ({
  initialData,
}: ApplicationStatsChartProps) => {
  const { data, error, isLoading } = useQuery<{
    success: boolean;
    data: CohortStats[];
  }>({
    queryKey: ["cohorts-stats"],
    queryFn: async () => {
      const res = await fetch("/api/cohorts/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    initialData: initialData ? { success: true, data: initialData } : undefined,
  });

  const chartData = {
    labels: data?.data.map((d) => d.name) || [],
    datasets: [
      {
        label: "Male",
        data: data?.data.map((d) => d.male) || [],
        backgroundColor: "#3b82f6",
        stack: "stack0",
      },
      {
        label: "Female",
        data: data?.data.map((d) => d.female) || [],
        backgroundColor: "#ec4899",
        stack: "stack0",
      },
    ],
  };

  const options = {
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
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className='w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200'>
      <div className='relative h-64'>
        {error ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 text-red-500'>
            <AlertTriangle className='w-8 h-8' />
            <p>Failed to load data</p>
            <p className='text-sm text-gray-500'>{error.message}</p>
          </div>
        ) : isLoading ? (
          <ChartSkeleton />
        ) : data?.data.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 text-gray-500'>
            <Search className='w-8 h-8' />
            <p>No application data available</p>
            <p className='text-sm'>
              There are no cohorts with applicant data to display
            </p>
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};
