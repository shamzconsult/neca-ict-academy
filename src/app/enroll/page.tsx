import ApplicationPortal from "@/components/atom/Application-Portal";
import { getCohortNames } from "@/services/admin/admin.server";
import { getAllCourses } from "@/services/courses/courses.server";
import { Suspense } from "react";

export default async function ApplicationPortalPage() {
  const [cohorts, courses] = await Promise.all([
    getCohortNames(),
    getAllCourses(),
  ]);

  return (
    <Suspense fallback={<div></div>}>
      <ApplicationPortal cohorts={cohorts} courses={courses} />
    </Suspense>
  );
}
