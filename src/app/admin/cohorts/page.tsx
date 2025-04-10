import { Cohorts } from "@/components/molecules/admin/cohorts/Cohorts";
import { getAllCohorts } from "@/services/admin/admin.server";

export default async function Page() {
  const cohortsData = await getAllCohorts();
  return <Cohorts cohortsData={cohortsData} />;
}
