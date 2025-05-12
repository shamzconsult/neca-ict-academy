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

type CohortTableProps = {
  tableData: CohortType[];
  action: boolean;
  tableHead: Array<string>;
  handleEdit?: (cohort: CohortType, event: React.MouseEvent) => void;
  handleDelete?: (slug: string, event: React.MouseEvent) => void;
  handleRowClick?: (slug: string) => void;
  isEditToggle?: number | null;
  handleEditToggle?: (id: number | null) => void;
};

const CohortTable = ({
  tableData,
  action,
  tableHead,
  handleEdit,
  handleRowClick,
  handleDelete,
  isEditToggle,
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
    <Table className='rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
      <TableHead className='border-b border-gray-200 bg-gray-50'>
        <TableRow>
          {tableHead.map((header) => (
            <TableHeader
              key={header}
              className='text-gray-700 font-semibold text-sm tracking-wide uppercase py-3 px-4'
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
              as='a'
              className={`transition-colors duration-150 cursor-pointer hover:bg-blue-50 border-b last:border-b-0 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <TableCell className='py-3 px-4'>{cohort.name}</TableCell>
              <TableCell className='py-3 px-4'>
                {cohort.applicantCount || "0"}
              </TableCell>
              <TableCell className='py-3 px-4'>
                {cohort.admitted || "0"}
              </TableCell>
              <TableCell className='py-3 px-4'>
                {cohort.graduated || "0"}
              </TableCell>
              <TableCell className='py-3 px-4'>
                {cohort.declined || "0"}
              </TableCell>
              <TableCell className='py-3 px-4'>{cohort.startDate}</TableCell>
              <TableCell className='py-3 px-4'>{cohort.endDate}</TableCell>
              {action && (
                <TableCell
                  className={
                    cohort.active ? "text-green-600" : "text-[#e02b20]"
                  }
                >
                  {cohort.active ? "Active" : "Inactive"}
                </TableCell>
              )}
              {action && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() =>
                      handleEditToggle && handleEditToggle(cohort._id)
                    }
                    type='button'
                    className='cursor-pointer'
                  >
                    <CgMoreVertical />
                  </button>
                  {isEditToggle === cohort._id && (
                    <div
                      ref={menuRef}
                      className='absolute right-10 mt-2 font-semibold bg-white text-white border border-[#C4C4C4] rounded-md shadow-lg w-32 px-2'
                    >
                      <div className='py-1 flex flex-col gap-2'>
                        <button
                          onClick={(event) =>
                            handleEdit && handleEdit(cohort, event)
                          }
                          className='px-4 rounded-md py-2 text-sm bg-green-600 hover:bg-green-500 duration-300 cursor-pointer w-full'
                        >
                          Edit
                        </button>
                        <button
                          onClick={(event) =>
                            handleDelete && handleDelete(cohort.slug, event)
                          }
                          className='px-4 rounded-md bg-[#E02B20] hover:bg-[#e02a20ce] duration-300 py-2 text-sm cursor-pointer w-full'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          </Link>
        ))}
      </TableBody>
    </Table>
  );
};

export default CohortTable;
