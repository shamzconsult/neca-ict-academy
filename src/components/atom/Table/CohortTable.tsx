"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableStat,
  TableStatusBadge,
} from "./Table";
import { CohortType } from "@/types";
import { formatDisplayDate } from "@/utils/format-date";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CohortTableProps = {
  tableData: CohortType[];
  action: boolean;
  tableHead: Array<string>;
  handleEdit?: (cohort: CohortType, event: React.MouseEvent) => void;
};

const CohortTable = ({
  tableData,
  action,
  tableHead,
  handleEdit,
}: CohortTableProps) => {
  const router = useRouter();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow className="hover:bg-transparent border-b border-[#27156F]/10">
            {tableHead.map((header, i) => (
              <TableHeader
                key={header}
                align={
                  i === 0
                    ? "left"
                    : header === "Action" || header === "Status"
                      ? "center"
                      : "center"
                }
                className={i === 0 ? "min-w-[220px]" : undefined}
              >
                {header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((cohort) => (
            <TableRow
              key={cohort._id}
              onClick={() => router.push(`/admin/cohorts/${cohort.slug}`)}
            >
              <TableCell className="min-w-[220px] max-w-[280px]">
                <span
                  className="font-semibold text-[#27156F] line-clamp-2"
                  title={cohort.name}
                >
                  {cohort.name}
                </span>
              </TableCell>
              <TableCell align="center">
                <TableStat value={cohort.applicantCount ?? 0} />
              </TableCell>
              <TableCell align="center">
                <TableStat value={cohort.admitted ?? 0} />
              </TableCell>
              <TableCell align="center">
                <TableStat value={cohort.graduated ?? 0} />
              </TableCell>
              <TableCell align="center">
                <TableStat value={cohort.declined ?? 0} />
              </TableCell>
              <TableCell align="center" className="text-gray-600 whitespace-nowrap">
                {formatDisplayDate(cohort.startDate)}
              </TableCell>
              <TableCell align="center" className="text-gray-600 whitespace-nowrap">
                {formatDisplayDate(cohort.endDate)}
              </TableCell>
              {action && (
                <TableCell align="center">
                  <TableStatusBadge variant={cohort.active ? "active" : "inactive"}>
                    {cohort.active ? "Active" : "Inactive"}
                  </TableStatusBadge>
                </TableCell>
              )}
              {action && (
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) =>
                            handleEdit && handleEdit(cohort, event)
                          }
                          className="h-8 gap-1.5 border-[#27156F]/20 bg-white text-[#27156F] hover:bg-[#DBEAF6]/50"
                          aria-label="Update cohort"
                        >
                          <Pencil className="size-3.5" />
                          Update
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Update cohort</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CohortTable;
