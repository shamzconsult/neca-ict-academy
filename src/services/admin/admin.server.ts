import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";

interface CohortStats {
  _id: string;
  totalApplicants: number;
  admitted: number;
  graduated: number;
  declined: number;
  pending: number;
}

export const getAllCohorts = async () => {
  try {
    await connectViaMongoose();

    // Aggregate stats per cohort
    const stats = await Enrollment.aggregate([
      {
        $group: {
          _id: "$cohort",
          totalApplicants: { $sum: 1 },
          admitted: {
            $sum: {
              $cond: [{ $eq: ["$status", "admitted"] }, 1, 0],
            },
          },
          graduated: {
            $sum: {
              $cond: [{ $eq: ["$status", "graduated"] }, 1, 0],
            },
          },
          declined: {
            $sum: {
              $cond: [{ $eq: ["$status", "declined"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Map stats by cohort ID for quick lookup, with proper type
    const statsMap = stats.reduce<Record<string, CohortStats>>((acc, stat) => {
      acc[stat._id?.toString()] = stat as CohortStats;
      return acc;
    }, {});

    // Fetch all cohorts and attach stats
    const cohorts = await Cohort.find().sort({ createdAt: -1 }).lean();

    const cohortsWithStats = cohorts.map((cohort) => {
      const cohortId = String(cohort._id);
      const stat = statsMap[cohortId] || {
        _id: cohortId,
        totalApplicants: 0,
        admitted: 0,
        graduated: 0,
        declined: 0,
        pending: 0,
      };
      return {
        ...cohort,
        applicantCount: stat.totalApplicants,
        admitted: stat.admitted,
        graduated: stat.graduated,
        declined: stat.declined,
      };
    });
    return JSON.parse(JSON.stringify(cohortsWithStats));
  } catch (error) {
    console.error("Error fetching cohort: ", error);
    return [];
  }
};

export const getActiveCohortsForEnrollment = async () => {
  try {
    await connectViaMongoose();
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const cohortNames = await Cohort.find({
      active: true,
      applicationEndDate: { $gte: today },
    })
      .select("_id name courses")
      .populate("courses", "title _id", Course);
    return JSON.parse(JSON.stringify(cohortNames));
  } catch (error) {
    console.error("Error fetching cohort names: ", error);
  }
};

export const getAllApplicants = async () => {
  await connectViaMongoose();
  try {
    const res = await Applicant.find({}).sort({ createdAt: -1 });
    const data = JSON.parse(JSON.stringify(res));
    return data;
  } catch (error) {
    console.error("Error fetching applicants: ", error);
    return null;
  }
};

export const getNumberOfApplicants = async () => {
  await connectViaMongoose();
  try {
    const totalApplicants = Enrollment.countDocuments({});
    const totalDeclined = Enrollment.countDocuments({
      status: "Declined",
    });
    const totalAdmitted = Enrollment.countDocuments({
      status: "Admitted",
    });
    const totalGraduated = Enrollment.countDocuments({
      status: "Graduated",
    });
    const totalPending = Enrollment.countDocuments({
      status: "Pending",
    });

    const [
      totalApplicantsValue,
      totalDeclinedValue,
      totalAdmittedValue,
      totalGraduatedValue,
      totalPendingValue,
    ] = await Promise.all([
      totalApplicants,
      totalDeclined,
      totalAdmitted,
      totalGraduated,
      totalPending,
    ]);

    return [
      { name: "Total Applicants", value: totalApplicantsValue },
      { name: "Total Pending", value: totalPendingValue },
      { name: "Total Declined", value: totalGraduatedValue },
      { name: "Total Admitted", value: totalDeclinedValue },
      { name: "Total Graduated", value: totalAdmittedValue },
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
    console.error("Error fetching cohort by slug:", error);
    return null;
  }
};

export const getCohortApplicants = async (slug: string) => {
  try {
    await connectViaMongoose();
    const cohort = await Cohort.findOne({ slug });
    if (!cohort) return null;

    const applicants = await Enrollment.find({ cohort: cohort._id })
      .populate("applicant", "", Applicant)
      .populate("course", "", Course)
      .populate("cohort", "", Cohort);

    return JSON.parse(JSON.stringify(applicants));
  } catch (error) {
    console.error("Error fetching cohort applicants:", error);
    return null;
  }
};
