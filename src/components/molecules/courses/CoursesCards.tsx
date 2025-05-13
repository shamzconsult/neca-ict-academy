import { CourseCard } from "@/components/atom/CourseCard";
import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/types";
import React, { useState } from "react";

export const CoursesCards = ({ courses }: { courses: CourseType[] }) => {
  const [filteredData] = useState<CourseType[]>(courses);

  return (
    <div>
      <section className="mb-20 flex flex-col justify-center items-center">
        <div className="bg-[#DBEAF6] w-full py-16">
          <div className="max-w-6xl mx-auto flex flex-col justify-center items-center gap-3 text-center mb-4">
            <SubHeading>Explore Courses</SubHeading>
            <Heading>Build the Skills for a Future in Tech!</Heading>
            <p className="max-w-4xl md:text-[20px]">
              Discover industry-relevant courses designed to equip you with the
              knowledge and hands-on experience needed to excel in today&#8217;s
              digital world.
            </p>
          </div>
        </div>
        <CourseCard courses={filteredData} />
      </section>
    </div>
  );
};
