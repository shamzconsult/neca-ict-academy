"use client";

import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { Heading } from "@/components/atom/headers/Heading";
import { courseDetails, CourseType } from "@/const/courses";

export const CourseDetails = ({
  courseData: { title },
}: {
  courseData: CourseType;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "2%",
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_: number, newIndex: number) => setCurrentIndex(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-center">
      <div className="max-w-5xl mx-auto text-center">
        <SubHeading> Course Details</SubHeading>
        <Heading>{` ${title} Course Details`}</Heading>
      </div>
      <div className="relative max-w-6xl mx-auto mt-8">
        <Slider {...settings}>
          {courseDetails.map((detail, index) => (
            <div
              key={index}
              className={`bg-white text-center text-[12px] rounded-xl shadow-lg p-6  max-w-sm transition-all text-[#000000] duration-500 ${
                index === currentIndex
                  ? "scale-110 z-10"
                  : "scale-100 opacity-60"
              }`}
            >
              <div className="mb-4 flex justify-center items-center">
                {typeof detail.icon === "string" ? (
                  detail.icon
                ) : (
                  <detail.icon className=" w-[48px] h-[48px]" />
                )}
              </div>
              <h3 className="text-[16px] font-semibold mb-2 ">
                {detail.title}
              </h3>
              <p className=" font-semibold text-[#27156F]">{detail.value}</p>
              <p className="mt-4">{detail.description}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
