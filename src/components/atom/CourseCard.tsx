"use client";

import { CourseType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPlayBtn } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import Swal from "sweetalert2";
import { CourseOutline } from "../molecules/admin/courses/ManageCourses";
import EmptyState from "./EmptyState";

export const CourseCard = ({
  courses,
  setShowModal,
  setCourseToEdit,
  setFormData,
}: {
  courses: CourseType[];
  searchTerm?: string;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setCourseToEdit?: (course: CourseType | null) => void;
  setFormData?: (data: {
    title: string;
    description: string;
    lesson: string;
    duration: string;
    rating: string;
    review: string;
    skillLevel: string;
    courseOutlines: CourseOutline[];
  }) => void;
}) => {
  const [coursesData, setCoursesData] = useState<CourseType[]>(courses);
  const pathname = usePathname();
  const isCoursesPath = pathname === "/courses";
  const admin = pathname === "/admin/courses";
  const CardWrapper = admin ? "div" : Link;

  useEffect(() => {
    setCoursesData(courses);
  }, [courses]);

  const handleDelete = async (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E02B20",
      cancelButtonColor: "#000000",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/course/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete course");
        Swal.fire("Error", "Failed to delete the course.", "error");
        return;
      }

      setCoursesData((prevCourse) =>
        prevCourse.filter((course) => course.slug !== slug)
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Course deleted Successfully",
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting course: ", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handleEdit = (course: CourseType) => {
    if (setCourseToEdit && setFormData && setShowModal) {
      setCourseToEdit(course);
      setFormData({
        title: course.title,
        description: course.description,
        lesson: course.lesson,
        duration: course.duration,
        rating: course.rating,
        review: course.review,
        skillLevel: course.skillLevel,
        courseOutlines: course.courseOutlines,
      });
      setShowModal(true);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto  mt-8 `}>
      {coursesData.length > 0 ? (
        <div
          className={`grid justify-center gap-8 ${
            isCoursesPath || admin
              ? "grid-cols-1 md:grid-cols-2 lg:space-x-16"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {coursesData.map((course) => (
            <CardWrapper
              href={`/courses/${course.slug}`}
              key={course._id}
              className={`bg-white border border-[#C4C4C480] mx-auto ${
                admin ? "hover:bg-white" : "hover:bg-[#DBEAF6]"
              }  rounded-xl shadow-lg overflow-hidden p-4 text-left ${
                isCoursesPath || admin
                  ? "w-full md:w-[350px] lg:w-[500px] hover:cursor-pointer "
                  : ""
              }`}
            >
              <div
                className={`  relative  p3 ${
                  isCoursesPath || admin
                    ? "w-full  h-[250px] lg:h-[270px]"
                    : "w-full h-[250px]  lg:h-[189px] "
                }`}
              >
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>

              <h3 className="text-lg font-bold text-[#27156F] mt-4">
                {course.title}
              </h3>
              <div>
                {(isCoursesPath || admin) && (
                  <p className="font-bold mt-2 text-sm">About The Course</p>
                )}
                <p
                  className={`mt-1 ${
                    isCoursesPath ? "text-[12px]" : " text-sm"
                  } break-words overflow-hidden text-ellipsis`}
                >
                  {course.description}
                </p>
                <div>
                  {(isCoursesPath || admin) && (
                    <div className="text-sm mt-3 ">
                      <h3 className="font-bold mb-2 text-sm">Course Details</h3>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg">
                          <p className="font-semibold">Lesson</p>
                          <div className="flex gap-2  items-center ">
                            <span>
                              <BsPlayBtn />
                            </span>
                            <span className="text-nowrap">{course.lesson}</span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg">
                          <p className="font-semibold">Duration</p>
                          <div className="flex gap-2 items-center ">
                            <span>
                              <MdAccessTime />
                            </span>
                            <span className="text-nowrap">
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg">
                          <p className="font-semibold">Skill Level</p>
                          <div className="flex  gap-2 items-center ">
                            <span>
                              <FiBarChart />
                            </span>
                            <span className="text-nowrap">
                              {course.skillLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5">
                {(isCoursesPath || admin) && (
                  <p>
                    <span className="font-bold">{course.rating}</span>⭐{" "}
                    <span>({course.review})</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row justify-between lg:items-end mt-3">
                {(isCoursesPath || admin) && (
                  <div className="flex divide-x divide-[#525252] space-x-2  text-xs">
                    <span className="px-1">{course.skillLevel}</span>
                    <span className="px-1">Certificate</span>
                    <span className="px-1">Physical</span>
                  </div>
                )}
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="text-[#E02B20]  mt-3 inline-flex items-center hover:underline-offset-4 hover:underline"
                >
                  Learn More <span className="ml-2">→</span>
                </Link>
              </div>
              {admin && (
                <div className="mt-5 flex justify-between ">
                  <button
                    onClick={() => handleEdit(course)}
                    className="bg-green-600 hover:bg-green-500 duration-300 cursor-pointer text-white rounded-md py-1.5 px-4 w-24"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(event) => handleDelete(course.slug, event)}
                    className="rounded-md cursor-pointer  bg-[#E02B20] hover:bg-[#e02a20ce] duration-300  text-white py-1.5 px-4 w-24"
                  >
                    Delete
                  </button>
                </div>
              )}
            </CardWrapper>
          ))}
        </div>
      ) : (
        <EmptyState
          title=" No Course Uploaded yet"
          message="Check back later"
        />
      )}
    </div>
  );
};
