import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from "chart.js";
import { AlertTriangle, Search } from "lucide-react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface CohortStats {
  name: string;
  slug: string;
  applicantCount: number;
  createdAt?: Date;
}

interface ApplicationStatsChartProps {
  initialData?: CohortStats[];
}

export const ApplicationStatsChart = ({
  initialData,
}: ApplicationStatsChartProps) => {
  const [chartData, setChartData] = useState({
    labels: initialData?.map((c) => c.name) || ["Loading..."],
    datasets: [
      {
        label: "Applicants",
        fill: true,
        backgroundColor: "#27156F",
        borderColor: "#E02B20",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#47AA49",
        data: initialData?.map((c) => c.applicantCount) || [0],
      },
    ],
  });
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/cohort/applicant-stat");
          const result = await response.json();
          if (result.success) {
            setChartData({
              labels: result.data.map((c: CohortStats) => c.name),
              datasets: [
                {
                  ...chartData.datasets[0],
                  data: result.data.map((c: CohortStats) => c.applicantCount),
                },
              ],
            });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchData();
    }
  }, [initialData]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#47AA49",
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} applicants`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#ddd" },
        title: {
          display: true,
          text: "Number of Applicants",
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-[#C4C4C4]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Application stats</h2>
        <h2>By Cohort</h2>
      </div>

      <div className="relative h-64">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-red-500">
            <AlertTriangle className="w-8 h-8" />
            <p>Failed to load data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
            <Search className="w-8 h-8" />
            <p>No application data available</p>
            <p className="text-sm">
              There are no cohorts with applicant data to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
