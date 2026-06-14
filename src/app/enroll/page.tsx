import ApplicationPortal from "@/components/atom/Application-Portal";
import { PageLoader } from "@/components/atom/PageLoader";
import { getActiveCohortsForEnrollment } from "@/services/admin/admin.server";
import { Suspense } from "react";

// Revalidate hourly so application-window dates stay accurate without a DB hit on every request.
export const revalidate = 3600;

export default async function ApplicationPortalPage() {
  const cohorts = await getActiveCohortsForEnrollment();

  return (
    <Suspense fallback={<PageLoader />}>
      <ApplicationPortal cohorts={cohorts} />
    </Suspense>
  );
}
