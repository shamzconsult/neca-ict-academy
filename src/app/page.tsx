import { HomePage } from "@/components/molecules/home/HomePage";
import { getAllCourses } from "@/services/courses/courses.server";

export default async function Home() {
  const courses = await getAllCourses({ limit: 4 });
  return <HomePage courses={courses} />;
}
