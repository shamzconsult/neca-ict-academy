import { CourseCard } from "@/components/atom/CourseCard";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { courses } from "@/const/courses";
import Link from "next/link";
import React from "react";

export const FeaturedCourses = () => {
  return (
    <div
      className="w-full my-16 lg:mt-28"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/v1741270785/classroom-with-tables-chairs-sign-that-says-green-it_mscsmm.png')",
      }}
    >
      <div className="max-w-6xl mx-auto p-4 py-20">
        <div className="text-center lg:text-left">
          <SubHeading>Featured Courses</SubHeading>
          <p className="lg:text-2xl mt-4">
            Explore our handpicked selection of top-rated courses designed to
            equip you with in-demand skills and industry knowledge. Learn from
            experts and advance your career today!
          </p>
        </div>
        <CourseCard courses={courses} />
        <div className="flex justify-center items-center text-center">
          <Link
            href="/courses"
            className="bg-[#E02B20] cursor-pointer  text-white px-6 py-3  rounded-md mt-16 hover:shadow-xl transition"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};
