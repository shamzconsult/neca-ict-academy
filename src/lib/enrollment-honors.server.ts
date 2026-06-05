import mongoose from "mongoose";
import { EnrollmentHonor } from "@/models/enrollment-honor";
import { GraduationTitle } from "@/models/graduation-title";
import { Enrollment } from "@/models/enrollment";

export type HonorSummary = {
  _id: string;
  titleId: string;
  name: string;
  slug: string;
  scope: "course" | "cohort";
  badgeColor: string;
  notes?: string;
  awardedAt: string;
};

type PopulatedHonor = {
  _id: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  title: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    scope: "course" | "cohort";
    badgeColor: string;
  };
};

function formatHonor(honor: PopulatedHonor): HonorSummary {
  return {
    _id: honor._id.toString(),
    titleId: honor.title._id.toString(),
    name: honor.title.name,
    slug: honor.title.slug,
    scope: honor.title.scope,
    badgeColor: honor.title.badgeColor,
    notes: honor.notes || undefined,
    awardedAt: honor.createdAt.toISOString(),
  };
}

export async function getHonorsByEnrollmentIds(
  enrollmentIds: string[],
): Promise<Map<string, HonorSummary[]>> {
  const map = new Map<string, HonorSummary[]>();
  if (enrollmentIds.length === 0) return map;

  const objectIds = enrollmentIds.map((id) => new mongoose.Types.ObjectId(id));

  const honors = (await EnrollmentHonor.find({
    enrollment: { $in: objectIds },
  })
    .populate("title", "name slug scope badgeColor active")
    .sort({ createdAt: -1 })
    .lean()) as unknown as PopulatedHonor[];

  for (const honor of honors) {
    if (!honor.title) continue;
    const enrollmentId = honor.enrollment.toString();
    const formatted = formatHonor(honor);
    const existing = map.get(enrollmentId) ?? [];
    existing.push(formatted);
    map.set(enrollmentId, existing);
  }

  return map;
}

export async function getHonorsForEnrollment(
  enrollmentId: string,
): Promise<HonorSummary[]> {
  const map = await getHonorsByEnrollmentIds([enrollmentId]);
  return map.get(enrollmentId) ?? [];
}

export async function validateHonorAssignment(
  enrollmentId: string,
  titleId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const enrollment = (await Enrollment.findById(enrollmentId).lean()) as {
    status?: string;
    cohort?: mongoose.Types.ObjectId;
    course?: mongoose.Types.ObjectId;
  } | null;
  if (!enrollment) {
    return { ok: false, message: "Enrollment not found" };
  }

  if (String(enrollment.status).toLowerCase() !== "graduated") {
    return {
      ok: false,
      message: "Honors can only be assigned to graduated enrollments",
    };
  }

  const title = (await GraduationTitle.findById(titleId).lean()) as {
    active?: boolean;
    maxWinners?: number;
    scope?: "course" | "cohort";
    name?: string;
  } | null;
  if (!title || !title.active) {
    return { ok: false, message: "Graduation title not found or inactive" };
  }

  const existingOnEnrollment = await EnrollmentHonor.findOne({
    enrollment: enrollmentId,
    title: titleId,
  });
  if (existingOnEnrollment) {
    return { ok: false, message: "This title is already assigned to this student" };
  }

  if (title.maxWinners && title.maxWinners > 0) {
    let scopeEnrollmentIds: mongoose.Types.ObjectId[];

    if (title.scope === "cohort") {
      const cohortEnrollments = await Enrollment.find({
        cohort: enrollment.cohort,
        status: { $regex: /^graduated$/i },
      }).select("_id");
      scopeEnrollmentIds = cohortEnrollments.map((e) => e._id);
    } else {
      const courseEnrollments = await Enrollment.find({
        cohort: enrollment.cohort,
        course: enrollment.course,
        status: { $regex: /^graduated$/i },
      }).select("_id");
      scopeEnrollmentIds = courseEnrollments.map((e) => e._id);
    }

    const winnerCount = await EnrollmentHonor.countDocuments({
      title: titleId,
      enrollment: { $in: scopeEnrollmentIds },
    });

    if (winnerCount >= (title.maxWinners ?? 0)) {
      const scopeLabel =
        title.scope === "cohort" ? "this cohort" : "this course in this cohort";
      return {
        ok: false,
        message: `Maximum of ${title.maxWinners} winner(s) for "${title.name ?? "this title"}" in ${scopeLabel} already assigned`,
      };
    }
  }

  return { ok: true };
}
