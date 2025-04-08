import { Cohorts } from "@/components/molecules/admin/cohorts/Cohorts";
import { fetchCohortData } from "@/utils/server";

export default async function Page() {
  const cohortsData = await fetchCohortData();
  return <Cohorts cohortsData={cohortsData} />;
}
