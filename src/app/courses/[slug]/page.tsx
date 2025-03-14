import { CoursePreview } from "@/components/molecules/courses/coursepreview/CoursePreview";
import { getDynamicParams } from "@/utils/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await getDynamicParams(params);

  return <CoursePreview slug={slug} />;
}
