import { BsPlayBtn } from "react-icons/bs";
import { FiBarChart, FiAward } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { CourseType } from "@/types";

export const generateCourseDetails = (course: CourseType) => {
  return [
    {
      title: "Lessons",
      value: course.lesson,
      description: `This course includes ${course.lesson} carefully structured lessons designed to take you from foundational concepts to advanced skills. Each lesson is crafted to provide hands-on experience, covering key principles, practical applications, and essential techniques.`,
      icon: BsPlayBtn,
    },
    {
      title: "Duration",
      value: course.duration,
      description: `A ${course.duration} program with flexible and self-paced learning. Gain access to interactive sessions, recorded classes, and hands-on activities throughout your journey. Learn at your own pace while benefiting from real-time guidance and support.`,
      icon: MdAccessTime,
    },
    {
      title: "Skill Level",
      value: course.skillLevel,
      description: `This course is designed for ${course.skillLevel.toLowerCase()} level learners. The structured lessons and practical projects will guide you through the essential concepts and skills needed to excel in this field.`,
      icon: FiBarChart,
    },
    // {
    //   title: "Certificate",
    //   value: course.hasCertificate ? "Available" : "Not Available",
    //   description: course.hasCertificate
    //     ? "Upon successful completion of this course, you will receive a certificate recognizing your achievement and newly acquired skills."
    //     : "This course does not include a certificate upon completion.",
    //   icon: FiAward,
    // },
  ];
};
