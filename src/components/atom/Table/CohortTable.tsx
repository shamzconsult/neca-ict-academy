"use client";

import { useEffect, useRef } from "react";
import { CgMoreVertical } from "react-icons/cg";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "./Table";
import { CohortType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiPencil, HiTrash } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`inline-block px-3 py-1 rounded-md text-sm capitalize
      ${active ? "bg-green-200 text-green-800" : "bg-red-100 text-[#E02B20]"}`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

type CohortTableProps = {
  tableData: CohortType[];
  action: boolean;
  tableHead: Array<string>;
  handleEdit?: (cohort: CohortType, event: React.MouseEvent) => void;
  handleEditToggle?: (id: number | null) => void;
};

const CohortTable = ({
  tableData,
  action,
  tableHead,
  handleEdit,
  handleEditToggle,
}: CohortTableProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (handleEditToggle) {
          handleEditToggle(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleEditToggle]);

  return (
    <div className='rounded-lg shadow-md overflow-x-auto'>
      <Table className='rounded-lg min-w-[900px] bg-white'>
        <TableHead className='sticky top-0 z-10 border-b border-gray-200 bg-gray-50'>
          <TableRow>
            {tableHead.map((header, i) => (
              <TableHeader
                key={header}
                className={`text-gray-700 font-bold text-sm tracking-wide uppercase py-4 px-5 ${i === 0 ? "rounded-tl-lg" : ""} ${i === tableHead.length - 1 ? "rounded-tr-lg" : ""}`}
              >
                {header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((cohort: CohortType, idx: number) => (
            <Link
              key={cohort._id}
              href={`/admin/cohorts/${cohort.slug}`}
              passHref
              legacyBehavior
            >
              <TableRow
                className={`transition-colors duration-150 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <TableCell className='py-4 px-5 font-medium border-r border-gray-100 max-w-[180px] truncate'>
                  <span title={cohort.name}>{cohort.name}</span>
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.applicantCount || "0"}
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.admitted || "0"}
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.graduated || "0"}
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.declined || "0"}
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.startDate}
                </TableCell>
                <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                  {cohort.endDate}
                </TableCell>
                {action && (
                  <TableCell className='py-4 px-5 border-r border-gray-100 text-center'>
                    <StatusBadge active={cohort.active} />
                  </TableCell>
                )}
                {action && (
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className='relative py-4 px-5 text-center'
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={(event) =>
                              handleEdit && handleEdit(cohort, event)
                            }
                            className='inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 duration-300'
                            aria-label='Update cohort'
                          >
                            <Pencil className='w-4 h-4' />
                            Update
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Update Cohort</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                )}
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CohortTable;
