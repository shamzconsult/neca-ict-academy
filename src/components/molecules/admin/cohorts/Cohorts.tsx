"use client";

import { CohortForm } from "@/components/atom/CohortForm";
import EmptyState from "@/components/atom/EmptyState";
import { CohortsProps, CohortType } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgMoreVertical } from "react-icons/cg";
import { HiOutlinePlusCircle } from "react-icons/hi";
import Swal from "sweetalert2";

export const Cohorts = ({ cohortsData: initialCohorts }: CohortsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(initialCohorts);
  const [cohortToEdit, setCohortToEdit] = useState<CohortType | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    applicationStartDate: "",
    applicationEndDate: "",
  });

  const router = useRouter();

  const handleRowClick = (slug: string) => {
    router.push(`/admin/cohorts/${slug}`);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleMouseEnter = (id: number) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  useEffect(() => {
    async function fetchCohorts() {
      try {
        const res = await fetch("/api/cohort");
        const data: CohortType[] = await res.json();
        setCohortsData(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching cohorts: ", error);
      }
    }
    fetchCohorts();
  }, []);

  const handleDelete = async (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E02B20",
      cancelButtonColor: "#000000",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/cohort/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete cohort");
        Swal.fire("Error", "Failed to delete the cohort.", "error");
        return;
      }

      setCohortsData((prevCohort) =>
        prevCohort.filter((cohort) => cohort.slug !== slug)
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Cohort deleted Successfully",
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting cohort: ", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleEdit = (cohort: CohortType, event: React.MouseEvent) => {
    event.stopPropagation();
    if (setCohortToEdit && setFormData && setShowModal) {
      setCohortToEdit(cohort);
      setFormData({
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        applicationStartDate: cohort.applicationStartDate,
        applicationEndDate: cohort.applicationEndDate,
      });
      setShowModal(true);
    }
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
      {cohortsData.length > 0 ? (
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
              {cohortsData.map((cohort: CohortType) => (
                <tr
                  key={cohort._id}
                  onClick={() => handleRowClick(cohort.slug)}
                  onMouseEnter={() => handleMouseEnter(cohort._id)}
                  onMouseLeave={handleMouseLeave}
                  className="border-t border-[#C4C4C4] cursor-pointer hover:bg-slate-50"
                >
                  <td className="p-4">{cohort.name}</td>
                  <td className="p-4">{cohort.applicants.length || "0"}</td>
                  <td className="p-4">{cohort.admitted || "0"}</td>
                  <td className="p-4">{cohort.graduated || "0"}</td>
                  <td className="p-4">{cohort.declined || "0"}</td>
                  <td className="p-4">{cohort.startDate}</td>
                  <td className="p-4">{cohort.endDate}</td>
                  <td className="p-4">
                    <CgMoreVertical />
                    {hoveredRow === cohort._id && (
                      <div className="absolute right-10 mt-2 font-semibold bg-white text-white border  border-[#C4C4C4] rounded-md shadow-lg w-32 px-2">
                        <div className="py-1 flex flex-col gap-2">
                          <button
                            onClick={(event) => handleEdit(cohort, event)}
                            className="px-4 rounded-md py-2 text-sm bg-green-600   hover:bg-green-500 durtion-300 cursor-pointer w-full"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(event) =>
                              handleDelete(cohort.slug, event)
                            }
                            className="px-4 rounded-md bg-[#E02B20] hover:bg-[#e02a20ce] duration-300  py-2 text-sm  cursor-pointer w-full"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Cohort Created yet"
          message="Click on the create Cohort button to start"
        />
      )}
      {showModal && (
        <CohortForm
          toggleModal={toggleModal}
          setCohortsData={setCohortsData}
          cohortToEdit={cohortToEdit}
          setCohortToEdit={setCohortToEdit}
        />
      )}
    </div>
  );
};
