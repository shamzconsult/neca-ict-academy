import ApplicationPortal from "@/components/atom/Application-Portal";
import { getCohortNames } from "@/services/admin/admin.server";
import { Suspense } from "react";

export default async function ApplicationPortalPage() {
  const cohorts = await getCohortNames();

  return (
    <Suspense fallback={<div></div>}>
      <ApplicationPortal cohorts={cohorts} />
    </Suspense>
  );
}
