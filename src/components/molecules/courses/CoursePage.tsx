"use client";

import React from "react";
import { CourseHeroSection } from "./CourseHeroSection";
import { CoursesCards } from "./CoursesCards";
import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";
import { CourseType } from "@/types";

export const CoursePage = ({ courses }: { courses: CourseType[] }) => {
  return (
    <div className="bg-[#FBFBFB]">
      <Navbar />
      <CourseHeroSection />
      <CoursesCards courses={courses} />
      <Footer />
    </div>
  );
};
