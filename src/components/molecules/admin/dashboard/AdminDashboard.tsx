"use client";

import { useState } from "react";
import { CgMoreVertical } from "react-icons/cg";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { ApplicationStatsChart } from "./ApplicationStatsChart";

const statsData = [
  { label: "Total applicants", value: "1,150,000" },
  { label: "Total admitted", value: "25,985" },
  { label: "Total graduated", value: "10,000" },
  { label: "Total declined", value: "3,005" },
];

export const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [cohorts] = useState([
    {
      name: "Cohort 1.0",
      applicants: 2500,
      admitted: 1500,
      graduated: 450,
      declined: 50,
      startDate: "1/02/2025",
      endDate: "2/05/2025",
    },
    {
      name: "Cohort 2.0",
      applicants: 1234,
      admitted: 9507,
      graduated: 210,
      declined: 456,
      startDate: "2/05/2024",
      endDate: "2/08/2024",
    },
    {
      name: "Cohort 3.0",
      applicants: 5687,
      admitted: 1009,
      graduated: 386,
      declined: 196,
      startDate: "2/05/2024",
      endDate: "2/12/2023",
    },
    {
      name: "Cohort 4.0",
      applicants: 2500,
      admitted: 4587,
      graduated: 123,
      declined: 510,
      startDate: "1/02/2025",
      endDate: "2/05/2023",
    },
    {
      name: "Cohort 5.0",
      applicants: 25079,
      admitted: 1500,
      graduated: 450,
      declined: 123,
      startDate: "1/02/2025",
      endDate: "2/05/2022",
    },
  ]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div className="px-4 space-y-8 w-full pb-10">
      <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white">
        <h1 className="md:text-[20px] font-medium">Dashboard Overview</h1>
        <button
          onClick={toggleModal}
          className="bg-[#E02B20] text-nowrap flex items-center gap-1 text-white px-6 py-2.5 rounded-md cursor-pointer"
        >
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="p-4 border border-[#C4C4C4] rounded-md bg-white"
          >
            <p className="md:text-[20px] font-semibold">{stat.value}</p>
            <p className="">{stat.label}</p>
          </div>
        ))}
      </div>
      <ApplicationStatsChart />

      <section className="w-full">
        <div className="flex justify-between items-center py-3">
          <h2 className="text-xl font-semibold">Cohorts</h2>
          <a
            href="/admin/cohorts"
            className="text-[#E02B20] hover:underline-offset-8"
          >
            View All Cohorts
          </a>
        </div>
        <div className="overflow-x-auto border border-[#C4C4C4] p-2 rounded-lg">
          <table className="w-full table-auto   bg-white">
            <thead>
              <tr className="">
                {[
                  "Cohort Name",
                  "Total Applicants",
                  "Total Admitted",
                  "Total Graduated",
                  "Total Declined",
                  "Start Date",
                  "End Date",
                  "Action",
                ].map((header) => (
                  <th key={header} className="p-4 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort, index) => (
                <tr key={index} className="border-t border-[#C4C4C4]">
                  <td className="p-4">{cohort.name}</td>
                  <td className="p-4">{cohort.applicants.toLocaleString()}</td>
                  <td className="p-4">{cohort.admitted.toLocaleString()}</td>
                  <td className="p-4">{cohort.graduated.toLocaleString()}</td>
                  <td className="p-4">{cohort.declined.toLocaleString()}</td>
                  <td className="p-4">{cohort.startDate}</td>
                  <td className="p-4">{cohort.endDate}</td>
                  <td className="p-4">
                    <CgMoreVertical />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
            <h2 className="text-xl font-bold mb-4">Create Cohort</h2>
            <div className="space-y-4 ">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Cohort Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                  placeholder="Enter cohort name"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-[#C4C4C4] rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-[#C4C4C4] rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                {/* <button
                  className="px-4 py-2 bg-black text-white rounded-md"
                  onClick={toggleModal}
                >
                  Cancel
                </button> */}
                <button
                  onClick={toggleModal}
                  className="px-4 py-2 bg-[#E02B20] text-white rounded-md"
                >
                  Create Cohort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
