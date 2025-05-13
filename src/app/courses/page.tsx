import { CoursePage } from "@/components/molecules/courses/CoursePage";
import { getAllCourses } from "@/services/courses/courses.server";
import React from "react";

const page = async () => {
  const courses = await getAllCourses();
  return <CoursePage courses={courses} />;
};

export default page;
