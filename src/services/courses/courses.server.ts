import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";

interface GetAllCoursesOptions {
  limit?: number;
}

export const getAllCourses = async (options: GetAllCoursesOptions = {}) => {
  try {
    await connectViaMongoose();
    const query = Course.find();

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
