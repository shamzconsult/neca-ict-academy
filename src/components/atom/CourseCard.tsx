"use client";

import { CourseType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPlayBtn } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { toast } from "sonner";
import { CourseOutline } from "../molecules/admin/courses/ManageCourses";
import EmptyState from "./EmptyState";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

// Skeleton card component
const SkeletonCard = () => (
  <div className='bg-white border border-[#C4C4C480] rounded-xl shadow-lg overflow-hidden p-4 min-w-0 w-full max-w-full mx-auto animate-pulse'>
    <div className='rounded-md bg-gray-200 h-[220px] sm:h-[250px] lg:h-[270px] w-full mb-4' />
    <div className='h-6 bg-gray-200 rounded w-2/3 mb-2' />
    <div className='h-4 bg-gray-100 rounded w-1/2 mb-2' />
    <div className='h-4 bg-gray-100 rounded w-3/4 mb-4' />
    <div className='flex gap-2 mb-4'>
      <div className='h-6 w-20 bg-gray-100 rounded' />
      <div className='h-6 w-20 bg-gray-100 rounded' />
      <div className='h-6 w-20 bg-gray-100 rounded' />
    </div>
    <div className='h-4 bg-gray-100 rounded w-1/3 mb-2' />
    <div className='flex justify-between mt-5'>
      <div className='h-8 w-20 bg-gray-100 rounded' />
      <div className='h-8 w-20 bg-gray-100 rounded' />
    </div>
  </div>
);

export const CourseCard = ({
  courses,
  setShowModal,
  setCourseToEdit,
  setFormData,
  loading = false,
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
  loading?: boolean;
}) => {
  const pathname = usePathname();
  const isCoursesPath = pathname === "/courses";
  const admin = pathname === "/admin/courses";
  const CardWrapper = admin ? "div" : Link;
  const queryClient = useQueryClient();

  const handleDelete = async (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete course");
        toast.error("Failed to delete the course.");
        return;
      }

      // Invalidate the courses query so the UI updates
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course: ", error);
      toast.error("Something went wrong.");
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

  // Responsive grid classes
  const gridClass =
    "grid gap-8 gap-y-8 min-w-0 " +
    (admin
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2");

  if (loading) {
    // Show 3 skeletons on mobile, 6 on sm, 9 on lg for admin; 2/4/6 for public
    const skeletonCount = admin ? 9 : 6;
    return (
      <div className={cn("max-w-6xl mx-auto mt-8", admin && "max-w-auto")}>
        <div className={gridClass}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-6xl mx-auto mt-8", admin && "max-w-auto")}>
      {courses.length > 0 ? (
        <div className={gridClass}>
          {courses.map((course) => (
            <CardWrapper
              href={`/courses/${course.slug}`}
              key={course._id}
              className={
                "bg-white border border-[#C4C4C480] rounded-xl shadow-lg overflow-hidden p-4 text-left min-w-0 w-full max-w-full mx-auto " +
                (admin ? "hover:bg-white" : "hover:bg-[#DBEAF6]") +
                (isCoursesPath || admin ? " hover:cursor-pointer" : "")
              }
            >
              <div
                className={
                  "relative w-full min-w-0 " +
                  (isCoursesPath || admin
                    ? "h-[220px] sm:h-[250px] lg:h-[270px]"
                    : "h-[220px] sm:h-[250px] lg:h-[189px]")
                }
              >
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className='rounded-md object-cover'
                />
              </div>

              <h3 className='text-lg font-bold text-[#27156F] mt-4'>
                {course.title}
              </h3>
              <div>
                {(isCoursesPath || admin) && (
                  <p className='font-bold mt-2 text-sm'>About The Course</p>
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
                    <div className='text-sm mt-3 '>
                      <h3 className='font-bold mb-2 text-sm'>Course Details</h3>
                      <div className='grid grid-cols-3 gap-3 text-xs'>
                        <div className='flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg'>
                          <p className='font-semibold'>Lesson</p>
                          <div className='flex gap-2  items-center'>
                            <span>
                              <BsPlayBtn />
                            </span>
                            <span className='text-nowrap'>{course.lesson}</span>
                          </div>
                        </div>
                        <div className='flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg'>
                          <p className='font-semibold'>Duration</p>
                          <div className='flex gap-2 items-center '>
                            <span>
                              <MdAccessTime />
                            </span>
                            <span className='text-nowrap'>
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg'>
                          <p className='font-semibold'>Skill Level</p>
                          <div className='flex  gap-2 items-center '>
                            <span>
                              <FiBarChart />
                            </span>
                            <span className='text-nowrap'>
                              {course.skillLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className='mt-5'>
                {(isCoursesPath || admin) && (
                  <p>
                    <span className='font-bold'>{course.rating}</span>⭐{" "}
                    <span>({course.review})</span>
                  </p>
                )}
              </div> */}
              <div className='flex flex-col lg:flex-row justify-between lg:items-end mt-3'>
                {(isCoursesPath || admin) && (
                  <div className='flex divide-x divide-[#525252] space-x-2  text-xs'>
                    <span className='px-1'>{course.skillLevel}</span>
                    <span className='px-1'>Certificate</span>
                    <span className='px-1'>Physical</span>
                  </div>
                )}
                <p className='text-[#E02B20] mt-3 hover:underline-offset-4 hover:underline'>
                  Learn More →
                </p>
              </div>
              {admin && (
                <div className='mt-5 flex justify-between'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => handleEdit(course)}
                    className='inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 duration-300'
                    aria-label='Update cohort'
                  >
                    <Pencil className='w-4 h-4' />
                    Update
                  </Button>
                  {/* <button onClick={(event) => handleDelete(course.slug, event)}>
                    <Trash2 className='w-4 h-4 text-red-500 hover:text-red-600 duration-300' />
                  </button> */}
                </div>
              )}
            </CardWrapper>
          ))}
        </div>
      ) : (
        <EmptyState title='No Course Found' message='' />
      )}
    </div>
  );
};
