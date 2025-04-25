"use client";

import { useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { ApplicationStatsChart } from "./ApplicationStatsChart";
import { CohortForm } from "@/components/atom/CohortForm";
import Link from "next/link";
import { CohortsProps, CohortType } from "@/types";
import EmptyState from "@/components/atom/EmptyState";

const statsData = [
  { label: "Total applicants", value: "1,150,000" },
  { label: "Total admitted", value: "25,985" },
  { label: "Total graduated", value: "10,000" },
  { label: "Total declined", value: "3,005" },
];

export const AdminDashboard = ({
  cohortsData: initialCohorts,
}: CohortsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(initialCohorts);

  useEffect(() => {
    async function fetchCohorts() {
      try {
        const res = await fetch("/api/cohort");
        const data: CohortType[] = await res.json();
        setCohortsData(data);
      } catch (error) {
        console.error("Error fetching cohorts: ", error);
      }
    }
    fetchCohorts();
  }, []);
  console.log(cohortsData);

  const firstFiveCohorts = cohortsData.slice(0, 5);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div className="md:px-4 space-y-8 w-full pb-10">
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
          <Link
            href="/admin/cohorts"
            className="text-[#E02B20] hover:underline hover:underline-offset-8"
          >
            View All Cohorts
          </Link>
        </div>
        <div className="overflow-x-auto border border-[#C4C4C4]  ">
          {cohortsData?.length > 0 ? (
            <table className="w-full table-auto   bg-white">
              <thead>
                <tr className="text-nowrap">
                  {[
                    "Cohort Name",
                    "Total Applicants",
                    "Total Admitted",
                    "Total Graduated",
                    "Total Declined",
                    "Start Date",
                    "End Date",
                  ].map((header) => (
                    <th key={header} className="p-4 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firstFiveCohorts.map((cohort, index) => (
                  <tr key={index} className="border-t border-[#C4C4C4]">
                    <td className="p-4">{cohort.name}</td>
                    <td className="p-4">{cohort.applicants?.length || "0"}</td>
                    <td className="p-4">{cohort.admitted || "0"}</td>
                    <td className="p-4">{cohort.graduated || "0"}</td>
                    <td className="p-4">{cohort.declined || "0"}</td>
                    <td className="p-4">{cohort.startDate}</td>
                    <td className="p-4">{cohort.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No Cohort Created yet"
              message="Click on the create Cohort button to start"
            />
          )}
        </div>
      </section>

      {showModal && (
        <CohortForm toggleModal={toggleModal} setCohortsData={setCohortsData} />
      )}
    </div>
  );
};
