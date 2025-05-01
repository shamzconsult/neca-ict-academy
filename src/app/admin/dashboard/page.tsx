import { AdminDashboard } from "@/components/molecules/admin/dashboard/AdminDashboard";
import {
  getAllCohorts,
  getNumberOfApplicants,
} from "@/services/admin/admin.server";
import React from "react";

export default async function Page() {
  const cohortsData = await getAllCohorts();
  const getDashboardsStats = await getNumberOfApplicants();
  return (
    <AdminDashboard
      cohortsData={cohortsData}
      dashboardStats={getDashboardsStats}
    />
  );
}
