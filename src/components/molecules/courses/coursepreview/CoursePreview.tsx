import { maincourses } from "@/const/courses";
import Link from "next/link";
import React from "react";
import { CoursePreviewHero } from "./CoursePreviewHero";
import { TrackCards } from "./TrackCards";
import { CourseDetails } from "./CourseDetails";
import { JoinUs } from "@/components/atom/JoinUs";
import { Navbar } from "@/components/atom/Navbar";
import { Footer } from "@/components/atom/Footer";

export const CoursePreview = ({ slug }: { slug: string }) => {
  const courseData = maincourses.find((course) => {
    return course.slug == slug;
  });
  if (!courseData) {
    return (
      <div className=" h-screen mt2 flex flex-col justify-center items-center">
        <h1 className="text-center font-bold  ">Course not found</h1>
        <Link
          className="text-sm text-slate-400 hover:underline cursor-pointer"
          href="/courses"
        >
          Click here to check other courses
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <CoursePreviewHero courseData={courseData} />
      <TrackCards />
      <CourseDetails courseData={courseData} />
      <JoinUs />
      <Footer />
    </div>
  );
};
