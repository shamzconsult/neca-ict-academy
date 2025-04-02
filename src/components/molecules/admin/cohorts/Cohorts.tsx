"use client";

import { CohortForm } from "@/components/atom/CohortForm";
import { cohorts } from "@/const/cohort";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CgMoreVertical } from "react-icons/cg";
import { HiOutlinePlusCircle } from "react-icons/hi";

export const Cohorts = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRowClick = (slug: string) => {
    router.push(`/admin/cohorts/${slug}`);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="px-4 space-y-8 w-full pb-10">
      <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4">
        <h1 className="md:text-[20px] font-medium">Dashboard Overview</h1>
        <button
          onClick={toggleModal}
          className="bg-[#E02B20] text-nowrap flex items-center gap-1 text-white px-6 py-2.5 rounded-md cursor-pointer"
        >
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </div>
      <div className="overflow-x-auto   border border-[#C4C4C4]">
        <table className="w-full table-auto bg-white">
          <thead className="">
            <tr className="text-nowrap">
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
            {cohorts.map((cohort) => (
              <tr
                key={cohort.id}
                onClick={() => handleRowClick(cohort.slug)}
                className="border-t border-[#C4C4C4] cursor-pointer hover:bg-slate-50"
              >
                <td className="p-4">{cohort.name}</td>
                <td className="p-4">{cohort.applicants}</td>
                <td className="p-4">{cohort.admitted}</td>
                <td className="p-4">{cohort.graduated}</td>
                <td className="p-4">{cohort.declined}</td>
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
      {showModal && <CohortForm toggleModal={toggleModal} />}
    </div>
  );
};
