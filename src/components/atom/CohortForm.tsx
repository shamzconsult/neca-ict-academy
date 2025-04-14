import { CohortType } from "@/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const CohortForm = ({
  toggleModal,
  setCohortsData,
  editingMode,
  setEditingMode,
}: {
  toggleModal: () => void;
  editingMode?: CohortType | null;
  setCohortsData: Dispatch<SetStateAction<CohortType[]>>;
  setEditingMode: (cohort: CohortType | null) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    applicationStartDate: "",
    applicationEndDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append(
      "applicationStartDate",
      formData.applicationStartDate
    );
    formDataToSend.append("applicationEndDate", formData.applicationEndDate);

    try {
      const res = await fetch("/api/cohort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error("Failed to upload cohort:", await res.text());
        return;
      }

      const responseData = await res.json();
      setCohortsData((prevCohort) => [...prevCohort, responseData.newCohort]);

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
        title: "Cohort Created Successfully🎉🎉",
      });

      toggleModal();
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        applicationStartDate: "",
        applicationEndDate: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMode) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append(
      "applicationStartDate",
      formData.applicationStartDate
    );
    formDataToSend.append("applicationEndDate", formData.applicationEndDate);

    try {
      const res = await fetch(`/api/cohort/${editingMode._id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error updating course:", errorText);
        return;
      }

      const responseData = await res.json();

      setCohortsData((prev) =>
        prev.map((cohort) =>
          cohort.slug === editingMode.slug ? responseData.updatedCohort : cohort
        )
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
        title: "Cohort Updated Successfully 🎉",
      });

      setEditingMode(null);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        applicationStartDate: "",
        applicationEndDate: "",
      });
      toggleModal();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  useEffect(() => {
    if (editingMode) {
      setFormData({
        name: editingMode.name,
        startDate: editingMode.startDate,
        endDate: editingMode.endDate,
        applicationStartDate: editingMode.applicationStartDate,
        applicationEndDate: editingMode.applicationEndDate,
      });
    }
  }, [editingMode]);
  return (
    <>
      <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
          <h2 className="text-xl font-bold mb-4">
            {editingMode ? "Editing Cohort" : "Create Cohort"}
            {/* Create Cohort */}
          </h2>
          <form
            onSubmit={editingMode ? handleUpdate : handleSubmit}
            className="space-y-4 "
          >
            <div>
              <label className="block text-sm font-semibold mb-1">
                Cohort Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
                placeholder="Enter cohort name"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-semibold mb-1">
                Cohort Slug
              </label>
              <input
                type="text"
                onChange={(e) => setSlug(e.target.value)}
                value={slug}
                required
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
                placeholder="cohort-1.0"
              />
            </div> */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">
                  Application Start-Date
                </label>
                <input
                  type="date"
                  name="applicationStartDate"
                  value={formData.applicationStartDate}
                  onChange={handleChange}
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
                  name="applicationEndDate"
                  value={formData.applicationEndDate}
                  onChange={handleChange}
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
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
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
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-[#C4C4C4] rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-center space-x-2 mt-4">
              <button
                type="submit"
                className={`px-4 py-2 ${
                  editingMode
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-[#E02B20]  hover:bg-[#e02a20ce]"
                } duration-300 text-white w-full rounded-md cursor-pointer`}
              >
                {editingMode ? "Update Cohort" : "Create Cohort"}
                {/* Create Cohort */}
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md w-full cursor-pointer hover:bg-black/80"
                onClick={() => {
                  toggleModal();
                  setEditingMode(null);
                  setFormData({
                    name: "",
                    startDate: "",
                    endDate: "",
                    applicationStartDate: "",
                    applicationEndDate: "",
                  });
                }}
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
