import connectViaMongoose from "@/lib/db";
import Course from "@/models/course";

export const getAllCourses = async () => {
  try {
    await connectViaMongoose();
    const courses = await Course.find();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return [];
  }
};
