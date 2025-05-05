import { applicantTableHead } from '@/const';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { ApplicantDetail } from '@/types';

type ApplicantTableProps = {
  tableData: ApplicantDetail[];
};

const ApplicantTable = ({ tableData }: ApplicantTableProps) => {
  return (
    <Table className='border border-[#C4C4C4] rounded-lg'>
      <TableHead className='border-b border-[#C4C4C4]'>
        <TableRow>
          {applicantTableHead.map(header => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map(applicant => (
          <TableRow
            key={applicant._id}
            className='hover:bg-slate-50 border-b border-[#C4C4C4]'>
            <TableCell>
              {applicant.firstName} {applicant.lastName}
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
                    applicant.status === 'Admitted'
                      ? 'bg-green-100 text-[#78A55A]'
                      : applicant.status === 'Pending'
                        ? 'bg-yellow-100 text-[#F29D38]'
                        : applicant.status === 'Declined'
                          ? 'bg-red-100 text-[#E02B20]'
                          : 'bg-gray-100 text-[#525252]'
                  }`}>
                  {applicant.status}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicantTable;
