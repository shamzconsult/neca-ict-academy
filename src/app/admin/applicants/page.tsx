import ApplicantTable from '@/components/atom/Table/ApplicantTable';
import { getAllApplicants } from '@/services/admin/admin.server';

const ApplicantsPage = async () => {
  const data = await getAllApplicants();
  console.log(data);
  return (
    <div className='px-4 space-y-8 w-full pb-10'>
      <div className='flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4'>
        <h1 className='md:text-[20px] font-medium'>All Applicants</h1>
      </div>
      <ApplicantTable tableData={data} />
    </div>
  );
};

export default ApplicantsPage;
