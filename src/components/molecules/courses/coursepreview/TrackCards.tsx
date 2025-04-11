import { SubHeading } from "@/components/atom/headers/SubHeading";
import { courseModules } from "@/const/courses";
import { CourseType } from "@/types";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export const TrackCards = ({
  courseData: { title },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className="w-full my-16 lg:mt-28 bg-[#DBEAF6] py-16">
      <div className="max-w-6xl mx-auto p-4 lg:p-0 py-20">
        <div className="text-center lg:text-left">
          <SubHeading>{title}</SubHeading>
          <p className="md:text-2xl mt-4">
            Join the <span className="mx-1">{title}</span> to gain in-depth
            knowledge of software development, from designing and building
            applications to testing and deployment.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {courseModules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-2 lg:p-4 shadow-lg transition-transform hover:scale-105"
            >
              <div className="flex flex-col  items-center text-[#27156F] gap-4 mb-6">
                <div className="">
                  {typeof module.icon === "string" ? (
                    module.icon
                  ) : (
                    <module.icon className=" w-[48px] h-[58px]" />
                  )}
                </div>
                <div className="md:text-[16px] font-bold">
                  <p>
                    {module.month}: {module.title}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 ">
                {module.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-[12px] md:text-[14px]"
                  >
                    <span className="">
                      <FaCheckCircle className="text-[#27156F]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
