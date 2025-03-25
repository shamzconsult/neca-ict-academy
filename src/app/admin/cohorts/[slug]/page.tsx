import { CohortPreview } from "@/components/molecules/admin/cohorts/preview/CohortPreview";
import { getDynamicParams } from "@/utils/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await getDynamicParams(params);

  return <CohortPreview slug={slug} />;
}
