import { AdminDashboard } from "@/components/molecules/admin/dashboard/AdminDashboard";
import { getAllCohorts } from "@/services/admin/admin.server";
import React from "react";

export default async function Page() {
  const cohortsData = await getAllCohorts();
  return <AdminDashboard cohortsData={cohortsData} />;
}
