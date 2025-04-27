import { EnrollBtn } from "@/components/atom/EnrollBtn";
import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/types";
import React from "react";

export const CoursePreviewHero = ({
  courseData: { title, coverImage },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="flex flex-col lg:justify-between w-full items-center lg:flex-row gap-8 pt-44 px-4 lg:px-0">
        <div className="flex flex-col gap-6 justify-center text-center lg:text-left max-w-2xl lg:max-w-1/2">
          <Heading>{`Learn ${title} & build real-world applications.`}</Heading>
          <p className="lg:max-w-md md:text-[20px]">
            Master comprehensive skill sets and gain practical experience by
            creating real-world solutions from concept to completion.
          </p>
          <div className="mt-4">
            <EnrollBtn />
          </div>
        </div>
        <div className="bg-white p-3 flex justify-center items-center rounded-xl ">
          <img
            src={coverImage}
            alt="hero-image"
            className="rounded-xl h-[300px] md:h-[400px] md:w-[582px]"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto flex flex-col justify-center items-center text-center gap-2 mt-8 md:mt-24 px-2 lg:px-0">
        <SubHeading>About The Course</SubHeading>
        <h1 className="font-bold text-[24px] md:text-[36px] text-[#27156F] leading-normal md:leading-[50px]">
          Build Your Future in <span className="mx-1">{title}</span>
        </h1>
        <p className="md:text-[20px] text-center px-4 lg:px-0">
          This <span className="mx-1">{title}</span> course is designed to
          provide you with a solid foundation and a broad understanding of core
          concepts. You&#8217;ll explore fundamental principles, essential
          tools, and best practices through immersive projects. Whether
          you&#8217;re new to the subject or aiming to refine your expertise,
          this course will equip you to tackle real-world challenges and create
          impactful solutions with confidence
        </p>
      </section>
    </div>
  );
};
