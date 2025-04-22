import ApplicationPortal from '@/components/atom/Application-Portal';
import { getAllCohorts, getCohortNames } from '@/services/admin/admin.server';

export default async function ApplicationPortalPage() {
  const cohorts = await getCohortNames();
  const allCohorts = await getAllCohorts();
  console.log('allCohorts: ', allCohorts);

  console.log('cohorts: ', cohorts);
  return <ApplicationPortal cohorts={cohorts} />;
}
