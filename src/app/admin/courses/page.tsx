import { ManageCourses } from "@/components/molecules/admin/courses/ManageCourses";
import { getAllCourses } from "@/services/courses/courses.server";

export default async function Page() {
  const courses = await getAllCourses();
  return <ManageCourses courses={courses} />;
}
