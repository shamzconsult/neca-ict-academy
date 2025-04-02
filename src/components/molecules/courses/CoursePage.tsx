"use client";

import React from "react";
import { CourseHeroSection } from "./CourseHeroSection";
import { CoursesCards } from "./CoursesCards";
import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";

export const CoursePage = () => {
  return (
    <div>
      <Navbar />
      <CourseHeroSection />
      <CoursesCards />
      <Footer />
    </div>
  );
};
