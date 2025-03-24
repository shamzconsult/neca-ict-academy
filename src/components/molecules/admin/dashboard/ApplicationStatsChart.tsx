import React from "react";
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

export const ApplicationStatsChart = () => {
  const data = {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "",
        fill: true,
        backgroundColor: "#C4C4C4",
        borderColor: "#27156F",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#47AA49",
        data: [5000, 15000, 30000, 50000, 10000, 20000, 40000, 60000],
      },
    ],
  };

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
          label: (tooltipItem) => `${tooltipItem.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#ddd" },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-[#C4C4C4]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Application stats</h2>
        <h2>Yearly</h2>
      </div>

      <div className="relative h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
