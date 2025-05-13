import ApplicationPortal from "@/components/atom/Application-Portal";
import { getCohortNames } from "@/services/admin/admin.server";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function ApplicationPortalPage() {
  const cohorts = await getCohortNames();

  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center h-screen'>
          <Loader2 className='animate-spin' />
        </div>
      }
    >
      <ApplicationPortal cohorts={cohorts} />
    </Suspense>
  );
}
