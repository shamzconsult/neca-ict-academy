import connectViaMongoose from "@/lib/db";
import Cohort from "@/models/cohort";

export const getAllCohorts = async () => {
  try {
    await connectViaMongoose();
    const cohorts = await Cohort.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(cohorts));
  } catch (error) {
    console.error("Error fetching cohort: ", error);
    return [];
  }
};

export const getCohortBySlug = async (slug: string) => {
  try {
    await connectViaMongoose();
    const cohort = await Cohort.findOne({ slug });
    if (!cohort) return null;
    return JSON.parse(JSON.stringify(cohort));
  } catch (error) {
    console.error("Error fetching cohort by slug:", error);
    return null;
  }
};
