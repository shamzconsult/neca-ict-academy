import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/types";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export const TrackCards = ({
  courseData: { title, courseOutlines },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className="w-full my-16 lg:mt-28 bg-[#DBEAF6] py-16">
      <div className="max-w-6xl mx-auto p-4 lg:p-0 py-20">
        <div className="text-center lg:text-left px-4">
          <SubHeading>{title}</SubHeading>
          <p className="md:text-2xl mt-4">
            Join the <span className="mx-1">{title}</span> to gain in-depth
            knowledge, from conceptualizing and designing solutions to hands-on
            implementation, evaluation, and final delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-4">
          {courseOutlines?.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-2 lg:p-4 shadow-lg transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-[#27156F] gap-4 mb-6">
                <div className="w-[48px] h-[48px] bg-[#27156F] text-white flex items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div className="md:text-[16px] font-bold text-center">
                  <p>{module.header}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {module.lists?.map((item: string, idx: number) =>
                  item ? (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-[12px] md:text-[14px]"
                    >
                      <FaCheckCircle className="text-[#27156F]" />
                      {item}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
