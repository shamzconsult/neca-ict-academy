import { getHonorsByEnrollmentIds } from "@/lib/enrollment-honors.server";
import { Applicant } from "@/models/applicant";
import Cohort from "@/models/cohort";
import Course from "@/models/course";
import { Enrollment } from "@/models/enrollment";
import { PipelineStage, Types } from "mongoose";

export type CohortLean = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  active: boolean;
  courses: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export const ALLOWED_SORT_FIELDS = ["createdAt", "status", "level"] as const;
export const ALLOWED_PAGE_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export type ApplicantsQueryParams = {
  page: number;
  limit: number;
  sortBy: (typeof ALLOWED_SORT_FIELDS)[number];
  sortOrder: 1 | -1;
  searchQuery: string;
  statusFilter: string;
  levelFilter: string;
  locationFilter: string;
  courseFilter: string;
};

type AggregationApplicant = {
  _id: Types.ObjectId;
  surname: string;
  otherNames: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender?: string;
  profilePicture?: { url: string; public_id: string };
};

type AggregationRow = {
  _id: Types.ObjectId;
  createdAt: Date;
  status: string;
  level: string;
  cv?: { url: string; public_id: string };
  employmentStatus: string;
  applicantDoc: AggregationApplicant;
  courseDoc?: { title: string };
};

type FacetResult = {
  metadata: { total: number }[];
  data: AggregationRow[];
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseApplicantsQueryParams(
  searchParams: URLSearchParams,
): ApplicantsQueryParams {
  const page = parseInt(searchParams.get("page") || "1");
  const limitParam = parseInt(
    searchParams.get("limit") || String(DEFAULT_PAGE_SIZE),
  );
  const limit = (ALLOWED_PAGE_SIZES as readonly number[]).includes(limitParam)
    ? limitParam
    : DEFAULT_PAGE_SIZE;
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const sortBy = ALLOWED_SORT_FIELDS.includes(
    sortByParam as (typeof ALLOWED_SORT_FIELDS)[number],
  )
    ? (sortByParam as (typeof ALLOWED_SORT_FIELDS)[number])
    : "createdAt";

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    searchQuery: searchParams.get("search") || "",
    statusFilter: searchParams.get("status") || "",
    levelFilter: searchParams.get("level") || "",
    locationFilter: searchParams.get("location") || "",
    courseFilter: searchParams.get("course") || "",
  };
}

function buildEnrollmentMatch(
  cohortId: Types.ObjectId,
  params: Pick<
    ApplicantsQueryParams,
    "statusFilter" | "levelFilter" | "courseFilter"
  >,
) {
  const match: Record<string, unknown> = { cohort: cohortId };
  if (params.statusFilter) match.status = params.statusFilter;
  if (params.levelFilter) match.level = params.levelFilter;
  if (params.courseFilter && Types.ObjectId.isValid(params.courseFilter)) {
    match.course = new Types.ObjectId(params.courseFilter);
  }
  return match;
}

function buildApplicantMatch(
  locationFilter: string,
  searchQuery: string,
): Record<string, unknown> | null {
  const clauses: Record<string, unknown>[] = [];

  if (locationFilter) {
    clauses.push({ "applicantDoc.state": locationFilter });
  }

  if (searchQuery) {
    const pattern = escapeRegex(searchQuery);
    clauses.push({
      $or: [
        { "applicantDoc.surname": { $regex: pattern, $options: "i" } },
        { "applicantDoc.otherNames": { $regex: pattern, $options: "i" } },
        { "applicantDoc.email": { $regex: pattern, $options: "i" } },
        { "applicantDoc.phoneNumber": { $regex: pattern, $options: "i" } },
      ],
    });
  }

  if (clauses.length === 0) return null;
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

function buildApplicantsPipeline(
  cohortId: Types.ObjectId,
  params: ApplicantsQueryParams,
  options?: { paginate?: boolean; paginateBeforeLookup?: boolean },
): PipelineStage[] {
  const { page, limit, sortBy, sortOrder, locationFilter, searchQuery } =
    params;
  const paginate = options?.paginate ?? true;
  const paginateBeforeLookup = options?.paginateBeforeLookup ?? false;

  const pipeline: PipelineStage[] = [
    { $match: buildEnrollmentMatch(cohortId, params) },
    { $sort: { [sortBy]: sortOrder } },
  ];

  if (paginate && paginateBeforeLookup) {
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
  }

  pipeline.push(
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
        from: Course.collection.name,
        localField: "course",
        foreignField: "_id",
        as: "courseDoc",
        pipeline: [{ $project: { title: 1 } }],
      },
    },
    { $unwind: { path: "$courseDoc", preserveNullAndEmptyArrays: true } },
  );

  const applicantMatch = buildApplicantMatch(locationFilter, searchQuery);
  if (applicantMatch) {
    pipeline.push({ $match: applicantMatch });
  }

  if (paginate && !paginateBeforeLookup) {
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    });
  }

  return pipeline;
}

function mapAggregationRow(row: AggregationRow, cohortName: string) {
  const applicant = row.applicantDoc;

  return {
    _id: String(applicant._id),
    surname: applicant.surname,
    otherNames: applicant.otherNames,
    email: applicant.email,
    phoneNumber: applicant.phoneNumber,
    state: applicant.state,
    gender: applicant.gender,
    profilePicture: applicant.profilePicture,
    createdAt: row.createdAt,
    cv: row.cv || null,
    status: row.status || "Not enrolled",
    level: row.level || "Not enrolled",
    course: row.courseDoc?.title ?? "No course",
    cohort: cohortName,
    enrollmentId: String(row._id),
    employmentStatus: row.employmentStatus,
  };
}

export async function getCohortApplicantStats(cohortId: Types.ObjectId) {
  const [result] = await Enrollment.aggregate<{
    totalApplicants: { total: number }[];
    statusBreakdown: { _id: string; count: number }[];
  }>([
    { $match: { cohort: new Types.ObjectId(cohortId) } },
    {
      $facet: {
        totalApplicants: [{ $group: { _id: "$applicant" } }, { $count: "total" }],
        statusBreakdown: [
          { $sort: { createdAt: -1 } },
          { $group: { _id: "$applicant", status: { $first: "$status" } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  const stats: Record<string, number> = {
    total: result?.totalApplicants[0]?.total ?? 0,
    pending: 0,
    declined: 0,
    admitted: 0,
    graduated: 0,
  };

  for (const entry of result?.statusBreakdown ?? []) {
    if (entry._id) {
      stats[String(entry._id).toLowerCase()] = entry.count;
    }
  }

  return stats;
}

export async function getCohortApplicantsPage(
  cohort: { _id: Types.ObjectId; name: string },
  params: ApplicantsQueryParams,
  options?: { paginate?: boolean },
) {
  const { page, limit, searchQuery, locationFilter } = params;
  const paginate = options?.paginate ?? true;
  const enrollmentMatch = buildEnrollmentMatch(cohort._id, params);
  const needsApplicantFilter = !!(searchQuery || locationFilter);

  let total = 0;
  let rows: AggregationRow[] = [];

  if (!paginate) {
    const pipeline = buildApplicantsPipeline(cohort._id, params, {
      paginate: false,
    });
    rows = await Enrollment.aggregate<AggregationRow>(pipeline);
    total = rows.length;
  } else if (needsApplicantFilter) {
    const pipeline = buildApplicantsPipeline(cohort._id, params, {
      paginate: true,
      paginateBeforeLookup: false,
    });
    const [result] = await Enrollment.aggregate<FacetResult>(pipeline);
    total = result?.metadata[0]?.total ?? 0;
    rows = result?.data ?? [];
  } else {
    const pipeline = buildApplicantsPipeline(cohort._id, params, {
      paginate: true,
      paginateBeforeLookup: true,
    });
    const [countResult, pageRows] = await Promise.all([
      Enrollment.countDocuments(enrollmentMatch),
      Enrollment.aggregate<AggregationRow>(pipeline),
    ]);
    total = countResult;
    rows = pageRows;
  }

  const enrichedApplicants = rows.map((row) =>
    mapAggregationRow(row, cohort.name),
  );

  const honorIds = rows.map((row) => String(row._id));
  const honorsMap = await getHonorsByEnrollmentIds(honorIds);
  const data = enrichedApplicants.map((row) => ({
    ...row,
    honors: honorsMap.get(String(row.enrollmentId)) ?? [],
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findCohortBySlug(
  slug: string,
  populateCourses = false,
): Promise<CohortLean | null> {
  const query = Cohort.findOne({ slug });
  if (populateCourses) {
    query.populate("courses", "title slug");
  }
  return query.lean() as Promise<CohortLean | null>;
}
