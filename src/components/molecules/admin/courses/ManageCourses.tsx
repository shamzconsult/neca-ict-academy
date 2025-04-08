"use client";

import { AddNewCourse } from "@/components/atom/AddNewCourse";
import { CourseCard } from "@/components/atom/CourseCard";
import { maincourses } from "@/const/courses";
import React, { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";

export const ManageCourses = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div className="px-4 space-y-8 w-full pb-10">
      <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4">
        <h1 className="md:text-[20px] font-medium">Course Overview</h1>
        <button
          onClick={toggleModal}
          className="bg-[#E02B20] text-nowrap flex items-center gap-1 text-white px-6 py-2.5 rounded-md cursor-pointer"
        >
          <HiOutlinePlusCircle /> Add New Course
        </button>
      </div>
      <CourseCard courses={maincourses} />
      {showModal && <AddNewCourse toggleModal={toggleModal} />}
    </div>
  );
};
