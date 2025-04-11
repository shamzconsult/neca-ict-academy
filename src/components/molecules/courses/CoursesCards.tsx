// import { CourseButtons } from "@/components/atom/CourseButtons";
import { CourseCard } from "@/components/atom/CourseCard";
import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/types";
import React, { useState } from "react";
import { GoSearch } from "react-icons/go";

export const CoursesCards = ({ courses }: { courses: CourseType[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<CourseType[]>(courses);

  // const choice = (category: string) => {
  //   setFilteredData(
  //     courses.filter((course) => {
  //       return course.category === category;
  //     })
  //   );
  //   setSearchTerm("");
  // };

  const handleSearch = () => {
    setFilteredData(
      courses.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  };
  return (
    <div>
      <section className="mb-20 flex flex-col justify-center items-center">
        <div className="bg-[#DBEAF6] w-full py-16">
          <div className="max-w-6xl mx-auto flex flex-col justify-center items-center gap-3 text-center mb-10">
            <SubHeading>Explore Courses</SubHeading>
            <Heading>Build the Skills for a Future in Tech!</Heading>
            <p className="max-w-4xl md:text-[20px]">
              Discover industry-relevant courses designed to equip you with the
              knowledge and hands-on experience needed to excel in today&#8217;s
              digital world.
            </p>
          </div>
          {/* <CourseButtons
            choice={choice}
            setFilteredData={setFilteredData}
            generalCourses={courses}
          /> */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 max-w-5xl  mx-auto px-4">
            <p className="text-[#1E1E1E]md:text-[20px] font-semibold">
              Search:
            </p>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-2 flex items-center ">
                <GoSearch className="h-5 w-5 text-[#C4C4C4]" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for courses"
                className="w-full h-[48px] px-8 rounded border border-[#C4C4C4] bg-white shadow-sm focus:outline-none focus:ring-0 focus:ring-none focus:bg-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 h-[48px] text-[12px] rounded-lg cursor-pointer bg-[#E02B20] text-white w-full md:w-fit "
            >
              Search
            </button>
          </div>
        </div>
        <CourseCard courses={filteredData} searchTerm={searchTerm} />
      </section>
    </div>
  );
};
