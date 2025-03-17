"use client";

import React from "react";
import { CourseHeroSection } from "./CourseHeroSection";
import { CoursesCards } from "./CoursesCards";

export const CoursePage = () => {
  return (
    <div>
      <CourseHeroSection />
      <CoursesCards />
    </div>
  );
};
