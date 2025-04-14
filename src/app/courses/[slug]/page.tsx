import { CoursePreview } from "@/components/molecules/courses/coursepreview/CoursePreview";
import { getCourseBySlug } from "@/services/courses/courses.server";
import { getDynamicParams } from "@/utils/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await getDynamicParams(params);
  const course = await getCourseBySlug(slug);

  return <CoursePreview course={course} />;
}
