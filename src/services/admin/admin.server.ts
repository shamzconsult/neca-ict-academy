import connectViaMongoose from '@/lib/db';
import Cohort from '@/models/cohort';
import Enrollment from '@/models/enrollment';

export const getAllCohorts = async () => {
  try {
    await connectViaMongoose();
    const cohorts = await Cohort.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(cohorts));
  } catch (error) {
    console.error('Error fetching cohort: ', error);
    return [];
  }
};

// get all cohorts with only id and name
export const getCohortNames = async () => {
  try {
    await connectViaMongoose();
    const cohortNames = await Cohort.find().select('_id, name ');
    return JSON.parse(JSON.stringify(cohortNames));
  } catch (error) {
    console.error('Error fetching cohort names: ', error);
  }
};

export const getNumberOfApplicants = async () => {
  await connectViaMongoose();
  try {
    const totalApplicants = await Enrollment.countDocuments({});
    const totalDeclined = await Enrollment.countDocuments({ status: 'Declined' });
    const totalAdmitted = await Enrollment.countDocuments({ status: 'Admitted' });
    const totalGraduated = await Enrollment.countDocuments({ status: 'Graduated' });
    return [
      { name: 'Total Applicants', value: totalApplicants },
      { name: 'Total Admitted', value: totalAdmitted },
      { name: 'Total Graduated', value: totalGraduated },
      { name: 'Total Declined', value: totalDeclined },
    ];
  } catch (error) {
    console.error(error);
  }
};

export const getCohortBySlug = async (slug: string) => {
  try {
    await connectViaMongoose();
    const cohort = await Cohort.findOne({ slug });
    if (!cohort) return null;
    return JSON.parse(JSON.stringify(cohort));
  } catch (error) {
    console.error('Error fetching cohort by slug:', error);
    return null;
  }
};
