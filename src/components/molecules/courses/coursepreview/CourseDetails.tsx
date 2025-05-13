"use client";

import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { Heading } from "@/components/atom/headers/Heading";
import { CourseType } from "@/types";
import { generateCourseDetails } from "@/const/courses";

interface CourseDetailsProps {
  course: CourseType;
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
  const courseDetails = generateCourseDetails(course);

  return (
    <div className='max-w-6xl mx-auto py-12 px-6 text-center'>
      <div className='max-w-5xl mx-auto text-center'>
        <SubHeading> Course Details</SubHeading>
        <Heading>{` ${course.title} Course Details`}</Heading>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-5'>
        {courseDetails.map((detail, index) => (
          <div
            key={index}
            className='bg-white text-center text-[12px] rounded-xl shadow-lg p-6 max-w-sm transition-all text-[#000000] duration-500 lg:scale-95 lg:nth-[2]:scale-100'
          >
            <div className='mb-4 flex justify-center items-center'>
              {typeof detail.icon === "string" ? (
                detail.icon
              ) : (
                <detail.icon className='w-[48px] h-[48px]' />
              )}
            </div>
            <h3 className='text-[16px] font-semibold mb-2'>{detail.title}</h3>
            <p className='font-semibold text-[#27156F]'>{detail.value}</p>
            <p className='mt-4'>{detail.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
