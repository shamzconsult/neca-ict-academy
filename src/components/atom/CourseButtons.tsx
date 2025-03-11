"use client";

import { CourseType } from "@/const/courses";
import { useState } from "react";

interface CoursesButtonsProps {
  choice: (category: string) => void;
  setCourses: (courses: CourseType[]) => void;
  generalCourses: CourseType[];
}

export const CourseButtons = ({
  choice,
  setCourses,
  generalCourses,
}: CoursesButtonsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handleButtonClick = (category: string) => {
    console.log("Button clicked:", category);
    setActiveCategory(category);
    if (category === "All") {
      setCourses(generalCourses);
    } else {
      choice(category);
    }
  };

  const buttonClasses = (category: string) =>
    `text-[#1E1E1E] border border-[#C4C4C4] px-6 cursor-pointer rounded-md py-2 duration-300 hover:border-none hover:bg-[#27156F] hover:text-white ${
      activeCategory === category ? "bg-[#27156F] text-white border-none" : ""
    }`;
  return (
    <div
      className="mx-auto text-center font-medium mb-8 flex justify-center items-center gap-4 
      overflow-x-auto whitespace-nowrap flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-2"
    >
      <button
        onClick={() => handleButtonClick("All")}
        className={buttonClasses("All")}
      >
        All programs
      </button>
      <button
        onClick={() => handleButtonClick("technical")}
        className={buttonClasses("technical")}
      >
        Technical Development
      </button>
      <button
        onClick={() => handleButtonClick("professional")}
        className={buttonClasses("professional")}
      >
        Professional Development
      </button>
      <button
        onClick={() => handleButtonClick("upskill")}
        className={buttonClasses("upskill")}
      >
        Tech Upskilling Programs
      </button>
      <button
        onClick={() => handleButtonClick("tech")}
        className={buttonClasses("tech")}
      >
        Tech Inclusion for SMEs
      </button>
    </div>
  );
};
