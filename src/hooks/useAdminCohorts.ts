import { CohortType } from "@/types";
import {
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type SetStateAction } from "react";

export const ADMIN_COHORTS_QUERY_KEY = ["admin-cohorts"] as const;

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

async function fetchAdminCohorts(): Promise<CohortType[]> {
  const res = await fetch("/api/admin/cohorts");
  if (!res.ok) throw new Error("Failed to fetch cohorts");
  const json = await res.json();
  return json.data ?? [];
}

export function useAdminCohorts() {
  return useQuery({
    queryKey: ADMIN_COHORTS_QUERY_KEY,
    queryFn: fetchAdminCohorts,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}

export function useSetAdminCohortsCache() {
  const queryClient = useQueryClient();

  return (updater: SetStateAction<CohortType[]>) => {
    queryClient.setQueryData<CohortType[]>(ADMIN_COHORTS_QUERY_KEY, (old) => {
      const prev = old ?? [];
      return typeof updater === "function" ? updater(prev) : updater;
    });
  };
}

export function invalidateAdminDashboardQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ADMIN_COHORTS_QUERY_KEY });
  void queryClient.invalidateQueries({ queryKey: ["applications-stats"] });
}
