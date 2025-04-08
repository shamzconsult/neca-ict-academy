import { AdminDashboard } from "@/components/molecules/admin/dashboard/AdminDashboard";
import { fetchCohortData } from "@/utils/server";
import React from "react";

export default async function Page() {
  const cohortsData = await fetchCohortData();
  return <AdminDashboard cohortsData={cohortsData} />;
}
