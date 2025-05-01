import { CohortPreview } from "@/components/molecules/admin/cohorts/preview/CohortPreview";
import { getCohortApplicants } from "@/services/admin/admin.server";
import { getDynamicParams } from "@/utils/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await getDynamicParams(params);
  const enrollments = await getCohortApplicants(slug);
  return <CohortPreview enrollments={enrollments} />;
}
