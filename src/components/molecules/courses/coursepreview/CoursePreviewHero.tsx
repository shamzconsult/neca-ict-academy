import { EnrollBtn } from "@/components/atom/EnrollBtn";
import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/const/courses";
import Image from "next/image";
import React from "react";

export const CoursePreviewHero = ({
  courseData: { title, image },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <section className=" flex flex-col lg:justify-between w-full items-center lg:flex-row gap-8 mt-32  px-4 lg:px-0">
        <div className="flex flex-col justify-center text-center lg:text-left max-w-2xl lg:max-w-1/2">
          <Heading>{`Learn ${title} & build real-world applications.`}</Heading>
          <p className="my-[29px] lg:max-w-md md:text-[20px]">
            Master full-stack development and gain hands-on experience by
            building real-world applications from start to finish.
          </p>
          <div>
            <EnrollBtn />
          </div>
        </div>
        <div className="w-full flex justify-center md:max-w-1/2">
          <div className=" w-full h-[300px] md:h-[400px]    md:w-[582px]  relative  ">
            <Image
              src={image}
              alt="hero-image"
              fill
              className="rounded-xl object-fit "
            />
          </div>
        </div>
      </section>
      <section className="max-w-5xl flex flex-col justify-center items-center text-center gap-2 mt-8 md:mt-24 px-2 lg:px-0">
        <SubHeading>About The Course</SubHeading>
        <Heading>
          Build Your Future with Our Software Engineering Course
        </Heading>
        <p className="md:text-[20px] text-center px-4 lg:px-0">
          This Software Engineering course is designed to provide you with a
          strong foundation in both front-end and back-end development.
          You&#8217;ll learn key programming languages, software architecture,
          and best practices through hands-on projects. Whether you&#8217;re a
          beginner or looking to enhance your skills, this course will prepare
          you for real-world challenges and help you build scalable applications
          with confidence.
        </p>
      </section>
    </div>
  );
};
