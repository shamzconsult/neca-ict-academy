import React from "react";
import { EnrollBtn } from "./EnrollBtn";
import { CourseType } from "@/types";

export const JoinUs = ({
  courseData: { title },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className="w-full lg:mt-8 bg-[#DBEAF6] py-20">
      <div
        className="max-w-6xl lg:mx-auto text-white flex flex-col justify-center items-center gap-4 text-center rounded-2xl py-10 px-2 md:px-6 mx-2 md:mx-6 h-full"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dcgghkk7q/image/upload/v1741858265/Frame_1618869616_pmzw4v.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-[18px] md:text-[32px] font-bold max-w-5xl mx-auto">
          Are you ready to dive into the exciting world of
          <span className="mx-1 lowercase"> {title}</span>?
        </h1>
        <p className="md:text-[20px] font-bold">
          Gain real-world experience through hands-on projects that mirror
          industry challenges, build a strong portfolio that showcases your
          technical skills, and become job-ready expert with the confidence to
          take on any development role. Master essential tools, collaborate on
          real-time assignments, and prepare yourself for a thriving career in
          tech.
        </p>
        <EnrollBtn />
      </div>
    </div>
  );
};
