import { applicantTableHead } from "@/const";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { EnrollmentType } from "@/types";

type ApplicantTableProps = {
  tableData: EnrollmentType[];
  status: string;
  level: string;
  searchTerm: string;
};

const ApplicantTable = ({ tableData }: ApplicantTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {applicantTableHead.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.length > 0 ? (
          tableData.map((applicant) => (
            <TableRow key={applicant._id} className='hover:bg-slate-50'>
              <TableCell>
                {applicant.surname} {applicant.otherNames}
              </TableCell>
              <TableCell>{applicant.email}</TableCell>
              <TableCell>{applicant.phoneNumber}</TableCell>
              <TableCell>{applicant.state}</TableCell>
              <TableCell>{applicant.course}</TableCell>
              <TableCell>{applicant.level}</TableCell>
              <TableCell>
                {applicant.status && (
                  <span
                    className={`px-3 py-1 text-nowrap rounded-md text-sm capitalize ${
                      applicant.status.toLowerCase() === "Admitted"
                        ? "bg-green-100 text-[#78A55A]"
                        : applicant.status === "Pending"
                          ? "bg-yellow-100 text-[#F29D38]"
                          : applicant.status.toLowerCase() === "declined"
                            ? "bg-red-100 text-[#E02B20]"
                            : "bg-gray-100 text-[#525252]"
                    }`}
                  >
                    {applicant.status}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <td colSpan={7} className='text-center text-red-500'>
              <div className='text-center font-bold py-24'>
                No results founds
              </div>
            </td>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ApplicantTable;
