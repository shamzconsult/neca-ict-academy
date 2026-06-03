import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import Cohort from "@/models/cohort";

interface GetAllCoursesOptions {
  limit?: number;
  cohort?: string; // cohort id or slug
}

type CohortApplicationFields = {
  active: boolean;
  applicationStartDate: string;
  applicationEndDate: string;
  courses?: Array<{ toString(): string }>;
};

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function isCohortAcceptingApplications(cohort: CohortApplicationFields) {
  const today = getTodayDateString();
  return (
    cohort.active &&
    cohort.applicationStartDate <= today &&
    cohort.applicationEndDate >= today
  );
}

export async function getOpenApplicationCourseIds() {
  const cohorts = await Cohort.find({ active: true })
    .select("courses applicationStartDate applicationEndDate active")
    .lean<CohortApplicationFields[]>();

  const openCourseIds = new Set<string>();

  for (const cohort of cohorts) {
    if (!isCohortAcceptingApplications(cohort)) continue;

    for (const courseId of cohort.courses ?? []) {
      openCourseIds.add(courseId.toString());
    }
  }

  return openCourseIds;
}

export const getAllCourses = async (options: GetAllCoursesOptions = {}) => {
  try {
    await connectViaMongoose();
    let courseIds: string[] | undefined;
    if (options.cohort) {
      // Try to find cohort by id or slug
      const cohort = await Cohort.findOne({
        $or: [{ _id: options.cohort }, { slug: options.cohort }],
      });
      if (cohort && cohort.courses && cohort.courses.length > 0) {
        courseIds = cohort.courses.map((id: { toString(): string }) =>
          id.toString()
        );
      } else {
        return [];
      }
    } else {
      // Only fetch courses in active cohorts
      const activeCohorts = await Cohort.find({ active: true });
      const allCourseIds = activeCohorts.flatMap((cohort) =>
        cohort.courses.map((id: { toString(): string }) => id.toString())
      );
      courseIds = [...new Set(allCourseIds)];
      if (courseIds.length === 0) return [];
    }
    const query = courseIds
      ? Course.find({ _id: { $in: courseIds } })
      : Course.find();
    query.sort({ createdAt: -1 });
    if (options.limit) {
      query.limit(options.limit);
    }
    const courses = await query;
    const openApplicationCourseIds = await getOpenApplicationCourseIds();

    const coursesWithStatus = courses.map((course) => ({
      ...course.toObject(),
      acceptingApplications: openApplicationCourseIds.has(course._id.toString()),
    }));

    return JSON.parse(JSON.stringify(coursesWithStatus));
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return [];
  }
};

export const getCourseBySlug = async (slug: string) => {
  try {
    await connectViaMongoose();
    const course = await Course.findOne({ slug });
    if (!course) return null;

    const openApplicationCourseIds = await getOpenApplicationCourseIds();

    return JSON.parse(
      JSON.stringify({
        ...course.toObject(),
        acceptingApplications: openApplicationCourseIds.has(
          course._id.toString(),
        ),
      }),
    );
  } catch (error) {
    console.error("Error fetching courses by slug:", error);
    return null;
  }
};
