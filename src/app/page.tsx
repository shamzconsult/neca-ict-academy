import { HomePage } from "@/components/molecules/home/HomePage";
import { getAllCourses } from "@/services/courses/courses.server";

export default async function Home() {
  const courses = await getAllCourses();
  return <HomePage courses={courses} />;
}
