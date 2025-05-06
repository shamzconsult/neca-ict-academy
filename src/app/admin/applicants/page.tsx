import EmptyState from '@/components/atom/EmptyState';
import ApplicantPreviewForm from '@/components/molecules/admin/cohorts/preview/applicant-preview-table';
import { getAllApplicants } from '@/services/admin/admin.server';

const ApplicantsPage = async () => {
  const data = await getAllApplicants();
  console.log(data);

  if (!data)
    return (
      <EmptyState
        message='No Applicants found'
        title='Check back later'
      />
    );
  return <ApplicantPreviewForm tableData={data} />;
};

export default ApplicantsPage;
