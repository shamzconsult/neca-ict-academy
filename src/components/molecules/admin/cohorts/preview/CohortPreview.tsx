"use client";

import EmptyState from "@/components/atom/EmptyState";
import { CohortType } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown, MdOutlineArrowCircleDown } from "react-icons/md";

export const CohortPreview = ({ cohort }: { cohort: CohortType }) => {
  const [searchTerm, setSearchTerm] = useState("");

  console.log(cohort);
  if (!cohort) {
    return (
      <div className=" h-screen mt2 flex flex-col justify-center items-center">
        <h1 className="text-center font-bold  ">Cohort not found</h1>
        <Link
          className="text-sm text-slate-400 hover:underline cursor-pointer"
          href="/admin/cohorts"
        >
          Click here to check other Cohort
        </Link>
      </div>
    );
  }

  const filteredData =
    cohort.applicantDetails?.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];

  return (
    <div className="p-6">
      <h1 className="md:text-[20px] font-semibold mb-6 p-3 bg-white w-full">
        {cohort.name}
      </h1>
      {filteredData && filteredData?.length > 0 ? (
        <section className="border border-[#C4C4C4] w-full">
          <div className="flex flex-col items-start md:flex-row justify-between md:items-center gap-4 p-4 w-full">
            <div className="relative w-full md:w-[70%]">
              <FaSearch className="absolute left-3 top-3 " />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border w-full border-[#C4C4C4] rounded-md focus:outline-none focus:ring-none focus:border-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border text-nowrap border-[#C4C4C4] rounded-md">
                All Status <MdKeyboardArrowDown />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border text-nowrap border-[#C4C4C4] rounded-md">
                <MdOutlineArrowCircleDown />
                Download Data
              </button>
            </div>
          </div>
          <div className="overflow-x-auto ">
            <table className="w-full table-auto bg-white">
              <thead>
                <tr>
                  {[
                    "Applicants",
                    "Course",
                    "Level",
                    "Location",
                    "Date",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-4 border-t border-[#C4C4C4] text-left font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData?.map((applicant, index) => (
                    <tr key={index} className="border-t border-[#C4C4C4]">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-nowrap">
                            {applicant.applicantName}
                          </span>
                          <span className="text-sm text-nowrap">
                            {applicant.applicantEmail}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-nowrap">{applicant.course}</td>
                      <td className="p-4">{applicant.level}</td>
                      <td className="p-4 text-nowrap">{applicant.location}</td>
                      <td className="p-4 text-nowrap">{applicant.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-nowrap rounded-md text-sm ${
                            applicant.status === "Admitted"
                              ? "bg-green-100 text-[#78A55A]"
                              : applicant.status === "Pending"
                              ? "bg-yellow-100 text-[#F29D38]"
                              : applicant.status === "Declined"
                              ? "bg-red-100 text-[#E02B20]"
                              : "bg-gray-100 text-[#525252]"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="hover:underline">Update</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[#C4C4C4]">
                    <td colSpan={7}>
                      <div className="text-center  font-bold py-24">
                        No results found for{" "}
                        <span className="text-red-400">
                          &#34;{searchTerm}&#34;{" "}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title=" No applicants for this cohort"
          message="Check back later"
        />
      )}
    </div>
  );
};
