import { SubHeading } from "@/components/atom/headers/SubHeading";
import { courses } from "@/const/courses";
import Image from "next/image";
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
          <p className="text-2xl mt-4">
            Explore our handpicked selection of top-rated courses designed to
            equip you with in-demand skills and industry knowledge. Learn from
            experts and advance your career today!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden p-4 text-left"
            >
              <div className="  w-full h-[250px] lg:h-[189px] lg:w-[331px]  relative p-3">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="rounded-md"
                />
              </div>

              <h3 className="text-lg font-bold text-[#27156F] mt-4">
                {course.title}
              </h3>
              <p className="mt-2 text-sm">{course.description}</p>
              <Link
                href=""
                className="text-[#E02B20]  mt-3 inline-flex items-center"
              >
                Learn More <span className="ml-2">→</span>
              </Link>
            </div>
          ))}
        </div>
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
