import ApplicationPortal from "@/components/atom/Application-Portal";
import { PageLoader } from "@/components/atom/PageLoader";
import { getActiveCohortsForEnrollment } from "@/services/admin/admin.server";
import { Suspense } from "react";

export default async function ApplicationPortalPage() {
  const cohorts = await getActiveCohortsForEnrollment();

  return (
    <Suspense fallback={<PageLoader />}>
      <ApplicationPortal cohorts={cohorts} />
    </Suspense>
  );
}
