"use client";

import React, { useState } from "react";
import { Toaster, toast } from "sonner";

export const CohortForm = ({ toggleModal }: { toggleModal: () => void }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicationStartDate, setApplicationStartDate] = useState("");
  const [applicationEndDate, setApplicationEndDate] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const clearForm = () => {
      setName("");
      setStartDate("");
      setEndDate("");
      setApplicationStartDate("");
      setApplicationEndDate("");
    };

    if (
      !name ||
      !applicationEndDate ||
      !applicationStartDate ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    try {
      const res = await fetch("/api/cohort", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          applicationEndDate,
          applicationStartDate,
          startDate,
          endDate,
        }),
      });
      const details = res;
      console.log(details);
      if (res.ok) {
        toast.success("Cohort created successfully 🎉");
        clearForm();
        toggleModal();
      } else {
        throw new Error("Failed to Create cohort");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
          <h2 className="text-xl font-bold mb-4">Create Cohort</h2>
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Cohort Name
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
                placeholder="Enter cohort name"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">
                  Application Start-Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setApplicationStartDate(e.target.value)}
                  value={applicationStartDate}
                  required
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">
                  Application End-Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setApplicationEndDate(e.target.value)}
                  value={applicationEndDate}
                  required
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  required
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  required
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-center space-x-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#E02B20]  hover:bg-[#e02a20ce] text-white w-full rounded-md cursor-pointer"
              >
                Create Cohort
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md w-full cursor-pointer hover:bg-black/80"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
