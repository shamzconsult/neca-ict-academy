import { getHonorsByEnrollmentIds } from "@/lib/enrollment-honors.server";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { EnrollmentHonor } from "@/models/enrollment-honor";
import { PipelineStage, Types } from "mongoose";

export const GRADUATE_PAGE_SIZES = [12, 24, 48] as const;
export const DEFAULT_GRADUATE_PAGE_SIZE = GRADUATE_PAGE_SIZES[0];

export type GraduatesQueryParams = {
  page: number;
  limit: number;
  search: string;
  year: string;
  cohort: string;
  course: string;
  titleId: string;
};

type GraduateRow = {
  _id: Types.ObjectId;
  updatedAt: Date;
  applicantDoc: {
    surname: string;
    otherNames: string;
    profilePicture?: { url?: string };
  };
  cohortDoc: {
    name: string;
    endDate?: string;
  };
  courseDoc: {
    title: string;
  };
  graduationYear: number;
};

type FacetResult = {
  metadata: Array<{ total: number }>;
  data: GraduateRow[];
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseGraduatesQueryParams(
  searchParams: URLSearchParams,
): GraduatesQueryParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limitParam = parseInt(
    searchParams.get("limit") || String(DEFAULT_GRADUATE_PAGE_SIZE),
    10,
  );
  const limit = (GRADUATE_PAGE_SIZES as readonly number[]).includes(limitParam)
    ? limitParam
    : DEFAULT_GRADUATE_PAGE_SIZE;

  return {
    page,
    limit,
    search: searchParams.get("search") || "",
    year: searchParams.get("year") || "",
    cohort: searchParams.get("cohort") || "",
    course: searchParams.get("course") || "",
    titleId: searchParams.get("titleId") || "",
  };
}

function graduatedMatchStage(enrollmentIds?: Types.ObjectId[]) {
  const match: Record<string, unknown> = {
    status: { $regex: /^graduated$/i },
  };
  if (enrollmentIds && enrollmentIds.length > 0) {
    match._id = { $in: enrollmentIds };
  } else if (enrollmentIds) {
    match._id = { $in: [] };
  }
  return match;
}

function buildGraduationYearField(): PipelineStage {
  return {
    $addFields: {
      graduationYear: {
        $cond: {
          if: {
            $and: [
              { $ne: ["$cohortDoc.endDate", null] },
              { $ne: ["$cohortDoc.endDate", ""] },
            ],
          },
          then: {
            $year: {
              $dateFromString: {
                dateString: "$cohortDoc.endDate",
                onError: "$updatedAt",
              },
            },
          },
          else: { $year: "$updatedAt" },
        },
      },
    },
  };
}

function buildLookupStages(): PipelineStage[] {
  return [
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
      $lookup: {
        from: Cohort.collection.name,
        localField: "cohort",
        foreignField: "_id",
        as: "cohortDoc",
      },
    },
    { $unwind: "$cohortDoc" },
    {
      $lookup: {
        from: Course.collection.name,
        localField: "course",
        foreignField: "_id",
        as: "courseDoc",
      },
    },
    { $unwind: "$courseDoc" },
    buildGraduationYearField(),
  ];
}

function buildFilterMatch(params: GraduatesQueryParams): Record<string, unknown> {
  const clauses: Record<string, unknown>[] = [];

  if (params.search) {
    const pattern = escapeRegex(params.search);
    clauses.push({
      $or: [
        { "applicantDoc.surname": { $regex: pattern, $options: "i" } },
        { "applicantDoc.otherNames": { $regex: pattern, $options: "i" } },
      ],
    });
  }

  if (params.year && params.year !== "all") {
    clauses.push({ graduationYear: Number(params.year) });
  }

  if (params.cohort && params.cohort !== "all") {
    clauses.push({ "cohortDoc.name": params.cohort });
  }

  if (params.course && params.course !== "all") {
    clauses.push({ "courseDoc.title": params.course });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

async function getHonorEnrollmentIds(titleId: string) {
  if (!titleId || titleId === "all") return undefined;
  const honorRows = await EnrollmentHonor.find({ title: titleId })
    .select("enrollment")
    .lean();
  return honorRows.map(
    (row) => new Types.ObjectId(String(row.enrollment)),
  );
}

async function buildBasePipeline(
  params: GraduatesQueryParams,
  honorEnrollmentIds?: Types.ObjectId[],
) {
  const honorIds = params.titleId && params.titleId !== "all"
    ? honorEnrollmentIds ?? (await getHonorEnrollmentIds(params.titleId))
    : undefined;

  return [
    { $match: graduatedMatchStage(honorIds) },
    ...buildLookupStages(),
  ] satisfies PipelineStage[];
}

export async function getGraduateFilterOptions(params: {
  year?: string;
  cohort?: string;
}) {
  const basePipeline = await buildBasePipeline({
    page: 1,
    limit: DEFAULT_GRADUATE_PAGE_SIZE,
    search: "",
    year: "",
    cohort: "",
    course: "",
    titleId: "",
  });

  const yearPipeline: PipelineStage[] = [
    ...basePipeline,
    { $group: { _id: "$graduationYear" } },
    { $sort: { _id: -1 } },
  ];

  const cohortMatch: Record<string, unknown> = {};
  if (params.year && params.year !== "all") {
    cohortMatch.graduationYear = Number(params.year);
  }

  const cohortPipeline: PipelineStage[] = [
    ...basePipeline,
    ...(Object.keys(cohortMatch).length > 0 ? [{ $match: cohortMatch }] : []),
    { $group: { _id: "$cohortDoc.name" } },
    { $sort: { _id: 1 } },
  ];

  const courseMatch: Record<string, unknown> = { ...cohortMatch };
  if (params.cohort && params.cohort !== "all") {
    courseMatch["cohortDoc.name"] = params.cohort;
  }

  const coursePipeline: PipelineStage[] = [
    ...basePipeline,
    ...(Object.keys(courseMatch).length > 0 ? [{ $match: courseMatch }] : []),
    { $group: { _id: "$courseDoc.title" } },
    { $sort: { _id: 1 } },
  ];

  const [yearRows, cohortRows, courseRows, totalGraduates] = await Promise.all([
    Enrollment.aggregate<{ _id: number }>(yearPipeline),
    Enrollment.aggregate<{ _id: string }>(cohortPipeline),
    Enrollment.aggregate<{ _id: string }>(coursePipeline),
    Enrollment.countDocuments({ status: { $regex: /^graduated$/i } }),
  ]);

  return {
    years: yearRows.map((row) => row._id).filter(Boolean),
    cohorts: cohortRows.map((row) => row._id).filter(Boolean),
    courses: courseRows.map((row) => row._id).filter(Boolean),
    totalGraduates,
  };
}

export async function getGraduatesPage(params: GraduatesQueryParams) {
  const { page, limit } = params;
  const honorIds =
    params.titleId && params.titleId !== "all"
      ? await getHonorEnrollmentIds(params.titleId)
      : undefined;

  const pipeline: PipelineStage[] = [
    ...((await buildBasePipeline(params, honorIds)) as PipelineStage[]),
  ];

  const filterMatch = buildFilterMatch(params);
  if (Object.keys(filterMatch).length > 0) {
    pipeline.push({ $match: filterMatch });
  }

  pipeline.push(
    { $sort: { updatedAt: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    },
  );

  const filterOptionsPromise = getGraduateFilterOptions({
    year: params.year,
    cohort: params.cohort,
  });

  const [[result], filters] = await Promise.all([
    Enrollment.aggregate<FacetResult>(pipeline),
    filterOptionsPromise,
  ]);

  const total = result?.metadata[0]?.total ?? 0;
  const rows = result?.data ?? [];

  const honorsMap = await getHonorsByEnrollmentIds(
    rows.map((row) => String(row._id)),
  );

  const data = rows.map((row) => {
    const enrollmentId = String(row._id);
    const applicant = row.applicantDoc;

    return {
      id: enrollmentId,
      fullName: `${applicant.surname} ${applicant.otherNames}`.trim(),
      profilePicture: applicant.profilePicture?.url ?? null,
      year: row.graduationYear,
      cohort: row.cohortDoc?.name ?? "Unknown cohort",
      course: row.courseDoc?.title ?? "Unknown course",
      honors: honorsMap.get(enrollmentId) ?? [],
    };
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    filters,
  };
}
