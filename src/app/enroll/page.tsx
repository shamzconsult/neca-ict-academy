import ApplicationPortal from "@/components/atom/Application-Portal";
import { getCohortNames } from "@/services/admin/admin.server";

export default async function ApplicationPortalPage() {
  const cohorts = await getCohortNames();
  return <ApplicationPortal cohorts={cohorts} />;
}
