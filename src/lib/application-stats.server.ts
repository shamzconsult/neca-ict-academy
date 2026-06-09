import { states } from "@/const";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import { Enrollment } from "@/models/enrollment";
import { PipelineStage, Types } from "mongoose";

type CountGroup = { _id: string; count: number };
type LocationGroup = {
  _id: string;
  male: number;
  female: number;
  total: number;
};

function toCountMap(groups: CountGroup[]) {
  return groups.reduce<Record<string, number>>((acc, group) => {
    if (group._id) acc[group._id] = group.count;
    return acc;
  }, {});
}

export async function getApplicationStats(cohortId?: string | null) {
  const matchStage: Record<string, unknown> = {};
  if (cohortId && cohortId !== "all" && Types.ObjectId.isValid(cohortId)) {
    matchStage.cohort = new Types.ObjectId(cohortId);
  }

  const pipeline: PipelineStage[] = [
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: Applicant.collection.name,
        localField: "applicant",
        foreignField: "_id",
        as: "applicantDoc",
      },
    },
    { $unwind: "$applicantDoc" },
    {
      $facet: {
        genderStats: [
          {
            $group: {
              _id: null,
              male: {
                $sum: {
                  $cond: [{ $eq: ["$applicantDoc.gender", "male"] }, 1, 0],
                },
              },
              female: {
                $sum: {
                  $cond: [{ $eq: ["$applicantDoc.gender", "female"] }, 1, 0],
                },
              },
              total: { $sum: 1 },
            },
          },
        ],
        statusStats: [
          {
            $group: {
              _id: { $toLower: "$status" },
              count: { $sum: 1 },
            },
          },
        ],
        levelStats: [
          {
            $group: {
              _id: { $toLower: "$level" },
              count: { $sum: 1 },
            },
          },
        ],
        locationByState: [
          {
            $group: {
              _id: "$applicantDoc.state",
              male: {
                $sum: {
                  $cond: [{ $eq: ["$applicantDoc.gender", "male"] }, 1, 0],
                },
              },
              female: {
                $sum: {
                  $cond: [{ $eq: ["$applicantDoc.gender", "female"] }, 1, 0],
                },
              },
              total: { $sum: 1 },
            },
          },
        ],
        totalApplications: [{ $count: "total" }],
      },
    },
  ];

  const [cohorts, [facetResult], recentActivity] = await Promise.all([
    Cohort.find({}, { name: 1 }).sort({ createdAt: -1 }).lean(),
    Enrollment.aggregate<{
      genderStats: Array<{
        male: number;
        female: number;
        total: number;
      }>;
      statusStats: CountGroup[];
      levelStats: CountGroup[];
      locationByState: LocationGroup[];
      totalApplications: Array<{ total: number }>;
    }>(pipeline),
    Enrollment.aggregate<{
      count: number;
      cohortName: string;
      cohortSlug: string;
    }>([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      },
      { $group: { _id: "$cohort", count: { $sum: 1 } } },
      { $match: { count: { $gt: 0 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: Cohort.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "cohort",
        },
      },
      { $unwind: "$cohort" },
      {
        $project: {
          _id: 0,
          count: 1,
          cohortName: "$cohort.name",
          cohortSlug: "$cohort.slug",
        },
      },
    ]),
  ]);

  const genderStats = facetResult?.genderStats[0] ?? {
    male: 0,
    female: 0,
    total: 0,
  };

  const locationMap = new Map(
    (facetResult?.locationByState ?? []).map((entry) => [entry._id, entry]),
  );

  const locationStats = states.map((state) => {
    const entry = locationMap.get(state);
    return {
      state,
      male: entry?.male ?? 0,
      female: entry?.female ?? 0,
      total: entry?.total ?? 0,
    };
  });

  return {
    locationStats,
    genderStats,
    statusStats: toCountMap(facetResult?.statusStats ?? []),
    levelStats: toCountMap(facetResult?.levelStats ?? []),
    cohorts: cohorts.map((cohort) => ({
      id: String(cohort._id),
      name: cohort.name,
    })),
    totalApplications: facetResult?.totalApplications[0]?.total ?? 0,
    recentActivity,
  };
}
