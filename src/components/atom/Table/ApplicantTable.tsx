import { applicantTableHead } from "@/const";
import { EnrollmentType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmptyRow,
  TableHead,
  TableHeader,
  TableRow,
  TableStatusBadge,
} from "./Table";

const getStatusVariant = (
  status: string
): "pending" | "admitted" | "declined" | "graduated" | "default" => {
  const normalized = status.toLowerCase();
  if (normalized === "admitted") return "admitted";
  if (normalized === "pending") return "pending";
  if (normalized === "declined") return "declined";
  if (normalized === "graduated") return "graduated";
  return "default";
};

type ApplicantTableProps = {
  tableData: EnrollmentType[];
};

const ApplicantTable = ({ tableData }: ApplicantTableProps) => {
  return (
    <TableContainer>
      <Table className="min-w-[800px]">
        <TableHead>
          <TableRow className="hover:bg-transparent border-b border-[#27156F]/10">
            {applicantTableHead.map((header, i) => (
              <TableHeader
                key={header}
                align={header === "Status" ? "center" : "left"}
                className={i === 0 ? "min-w-[180px]" : undefined}
              >
                {header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((applicant) => (
              <TableRow key={applicant._id}>
                <TableCell>
                  <span className="font-medium text-[#27156F]">
                    {applicant.surname} {applicant.otherNames}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{applicant.email}</TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">
                  {applicant.phoneNumber}
                </TableCell>
                <TableCell className="text-gray-600">{applicant.state}</TableCell>
                <TableCell className="max-w-[200px] truncate text-gray-600">
                  {applicant.course}
                </TableCell>
                <TableCell className="capitalize text-gray-600">
                  {applicant.level}
                </TableCell>
                <TableCell align="center">
                  {applicant.status && (
                    <TableStatusBadge variant={getStatusVariant(applicant.status)}>
                      {applicant.status}
                    </TableStatusBadge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmptyRow colSpan={applicantTableHead.length} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicantTable;
