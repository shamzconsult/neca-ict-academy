import connectViaMongoose from '@/lib/db';
import Cohort from '@/models/cohort';

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

// get all cohorts with only name
// this is used in the application portal to get all cohorts for the select input
export const getCohortNames = async () => {
  try {
    await connectViaMongoose();
    const cohortNames = await Cohort.find().select('_id, name ');
    return JSON.parse(JSON.stringify(cohortNames));
  } catch (error) {
    console.error('Error fetching cohort names: ', error);
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
