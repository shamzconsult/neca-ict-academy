"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import EmptyState from "@/components/atom/EmptyState";
import { CohortType } from "@/types";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { MdOutlineArrowCircleDown } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusOptions = ["Admitted", "Declined", "Pending", "Graduated"];
const levelOptions = [
  "Dropped",
  "Applied",
  "Interviewed",
  "Admitted",
  "Completed",
];

export const CohortPreview = ({ cohort }: { cohort: CohortType }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  const [formData, setFormData] = useState({
    status: "",
    level: "",
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${cohort.name} - Applicants List`, 14, 15);
    doc.setFontSize(12);

    const tableData = filteredData.map((applicant) => [
      `${applicant.fullName}\n${applicant.email}`,
      applicant.course,
      applicant.level,
      applicant.state,
      new Date(applicant.appliedAt).toDateString(),
      applicant.status,
    ]);

    autoTable(doc, {
      head: [["Applicants", "Course", "Level", "Location", "Date", "Status"]],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [33, 33, 33],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },
    });

    doc.save(`${cohort.name}-applicants.pdf`);
  };

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

  let filteredData = cohort.applicants || [];

  if (searchTerm) {
    filteredData = filteredData.filter((applicant) => {
      return (
        applicant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }

  if (status !== "all") {
    filteredData = filteredData.filter(
      (applicant) => applicant.status === status
    );
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("status", formData.status);
    formDataToSend.append("level", formData.level);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/applicant/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: formData.status,
            level: formData.level,
          }),
        });
        console.log("res", res);

        if (!res.ok) {
          console.error("Failed to update applicant:", await res.text());
          return;
        }

        const responseData = await res.json();
        console.log("Applicant updated successfully:", responseData);
        setFormData({
          status: formData.status,
          level: formData.level,
        });
        router.refresh();
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
          title: "Applicant updated",
        });
      } catch (error) {
        console.error("Error updating applicant:", error);
      }
    });
  };

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
              <select
                value={status}
                onChange={handleStatusChange}
                className="flex items-center px-2 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md"
              >
                <option value="all">All Status</option>
                {statusOptions.map((status, index) => (
                  <option value={status} key={index}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                className="flex items-center gap-2 px-4 py-2 border text-nowrap border-[#C4C4C4] cursor-pointer rounded-md"
                onClick={handleDownloadPDF}
              >
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
                            {applicant.fullName}
                          </span>
                          <span className="text-sm text-nowrap">
                            {applicant.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-nowrap">{applicant.course}</td>
                      <td className="p-4">{applicant.level}</td>
                      <td className="p-4 text-nowrap">{applicant.state}</td>
                      <td className="p-4 text-nowrap">
                        {new Date(applicant.appliedAt).toDateString()}
                      </td>
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
                        <Dialog>
                          <DialogTrigger className="cursor-pointer" asChild>
                            <button className="hover:underline cursor-pointer">
                              Update
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Applicant Profile</DialogTitle>
                            </DialogHeader>

                            <form
                              onSubmit={(e) => handleSubmit(e, applicant._id)}
                              className="space-y-4"
                            >
                              <div className="space-y-6 mt-5">
                                <label htmlFor="level">Level</label>
                                <select
                                  name="level"
                                  id="level"
                                  value={formData.level}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                                  disabled={isPending}
                                >
                                  <option value="">Select Level</option>
                                  {levelOptions.map((level, index) => (
                                    <option key={index} value={level}>
                                      {level}
                                    </option>
                                  ))}
                                </select>

                                <label htmlFor="status">Status</label>
                                <select
                                  name="status"
                                  id="status"
                                  value={formData.status}
                                  onChange={handleChange}
                                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                                  disabled={isPending}
                                >
                                  <option value="">Select Status</option>
                                  {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="mt-10 flex justify-end gap-4">
                                <button
                                  className=" bg-green-600 py-2 px-4 text-white rounded-lg cursor-pointer"
                                  disabled={isPending}
                                >
                                  {isPending
                                    ? "Updating..."
                                    : "Update Applicant"}
                                </button>
                                <DialogClose asChild>
                                  <button
                                    className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer"
                                    type="button"
                                  >
                                    Cancel
                                  </button>
                                </DialogClose>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
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
