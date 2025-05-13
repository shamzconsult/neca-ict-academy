import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";
import Cohort from "@/models/cohort";

interface GetAllCoursesOptions {
  limit?: number;
  cohort?: string; // cohort id or slug
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
        courseIds = cohort.courses.map((id: any) => id.toString());
      } else {
        return [];
      }
    }
    const query = courseIds
      ? Course.find({ _id: { $in: courseIds } })
      : Course.find();
    if (options.limit) {
      query.limit(options.limit);
    }
    const courses = await query;
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return [];
  }
};

export const getCourseBySlug = async (slug: string) => {
  try {
    await connectViaMongoose();
    const courses = await Course.findOne({ slug });
    if (!courses) return null;
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Error fetching courses by slug:", error);
    return null;
  }
};
