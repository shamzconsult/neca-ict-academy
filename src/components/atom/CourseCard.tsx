"use client";

import { CourseType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPlayBtn } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { CourseOutline } from "../molecules/admin/courses/ManageCourses";
import EmptyState from "./EmptyState";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  CircleCheck,
  CircleX,
  ExternalLink,
  MoreVertical,
  Pencil,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const SkeletonCard = ({
  showExtendedDetails = true,
  admin = false,
}: {
  showExtendedDetails?: boolean;
  admin?: boolean;
}) => (
  <div className='flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white shadow-sm animate-pulse'>
    {/* Cover image */}
    <div
      className={cn(
        "relative w-full overflow-hidden bg-gray-200",
        showExtendedDetails ? "aspect-[16/10]" : "aspect-[16/9]",
      )}
    >
      <div className='absolute inset-0 bg-gradient-to-t from-[#27156F]/20 via-transparent to-transparent' />

      {showExtendedDetails && (
        <>
          <div className='absolute left-3 top-3 h-6 w-20 rounded-full bg-white/80' />
          {!admin && (
            <div className='absolute right-3 top-3 h-6 w-28 rounded-full bg-white/80' />
          )}
        </>
      )}

      {admin && (
        <div className='absolute right-2 top-2 flex items-center gap-1.5'>
          <div className='h-6 w-24 rounded-full bg-white/80' />
          <div className='size-8 rounded-full bg-white/80' />
        </div>
      )}
    </div>

    {/* Content */}
    <div className='flex flex-1 flex-col gap-4 p-5'>
      <div className='space-y-2'>
        <div className='h-6 w-4/5 rounded-md bg-gray-200' />
        <div className='h-5 w-3/5 rounded-md bg-gray-200' />
        <div className='space-y-1.5 pt-1'>
          <div className='h-3 w-full rounded bg-gray-100' />
          <div className='h-3 w-full rounded bg-gray-100' />
          <div className='h-3 w-2/3 rounded bg-gray-100' />
        </div>
      </div>

      {showExtendedDetails && (
        <div className='grid grid-cols-3 divide-x divide-[#27156F]/10 rounded-xl bg-[#DBEAF6]/30'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-1.5 px-2 py-3'
            >
              <div className='size-4 rounded bg-gray-200' />
              <div className='h-2 w-10 rounded bg-gray-100' />
              <div className='h-4 w-8 rounded bg-gray-200' />
            </div>
          ))}
        </div>
      )}

      <div className='mt-auto flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='h-6 w-24 rounded-full bg-gray-100' />
          <div className='h-6 w-16 rounded-full bg-gray-100' />
        </div>
        <div className='h-9 w-32 rounded-full bg-gray-200' />
      </div>
    </div>
  </div>
);

const ApplicationStatusBadge = ({
  acceptingApplications,
  className,
}: {
  acceptingApplications: boolean;
  className?: string;
}) => (
  <Badge
    className={cn(
      "border-0 shadow-sm backdrop-blur-sm",
      acceptingApplications
        ? "bg-[#27156F] text-white hover:bg-[#27156F]/95"
        : "bg-gray-700/90 text-white hover:bg-gray-700/90",
      className,
    )}
  >
    {acceptingApplications ? (
      <CircleCheck className='size-3.5 shrink-0' aria-hidden />
    ) : (
      <CircleX className='size-3.5 shrink-0' aria-hidden />
    )}
    {acceptingApplications ? "Open for applications" : "Applications closed"}
  </Badge>
);

const CourseStat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className='flex flex-col items-center gap-1 px-2 py-2 text-center'>
    <span className='text-[#27156F]/70'>{icon}</span>
    <span className='text-[10px] font-medium uppercase tracking-wide text-gray-500'>
      {label}
    </span>
    <span className='text-sm font-semibold text-[#27156F]'>{value}</span>
  </div>
);

export const CourseCard = ({
  courses,
  setShowModal,
  setCourseToEdit,
  setFormData,
  loading = false,
  columnsPerRow = 2,
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
    hasCertificate: boolean;
    type: string;
  }) => void;
  loading?: boolean;
  columnsPerRow?: 2 | 3;
}) => {
  const pathname = usePathname();
  const isCoursesPath = pathname === "/courses" || pathname === "/";
  const admin = pathname === "/admin/courses";
  const showExtendedDetails = isCoursesPath || admin;
  const CardWrapper = admin ? "div" : Link;

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
        hasCertificate: course.hasCertificate,
        type: course.type,
      });
      setShowModal(true);
    }
  };

  const gridClass = cn(
    "grid min-w-0",
    admin
      ? "gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : columnsPerRow === 3
        ? "gap-4 md:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2",
  );

  const containerClass = cn(
    "mx-auto mt-8",
    admin && "max-w-auto",
    !admin && columnsPerRow === 3 && "w-full max-w-none",
    !admin && columnsPerRow !== 3 && "max-w-6xl",
  );

  if (loading) {
    const skeletonCount = admin ? 9 : 6;
    return (
      <div className={containerClass}>
        <div className={gridClass}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard
              key={i}
              showExtendedDetails={showExtendedDetails}
              admin={admin}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {courses.length > 0 ? (
        <div className={gridClass}>
          {courses.map((course) => (
            <CardWrapper
              href={`/courses/${course.slug}`}
              key={course._id}
              className={cn(
                "group flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white text-left shadow-sm transition-all duration-300",
                !admin &&
                  "hover:-translate-y-1 hover:border-[#27156F]/20 hover:shadow-xl",
                (isCoursesPath || admin) && !admin && "hover:bg-white",
                isCoursesPath || admin ? "cursor-pointer" : "",
              )}
            >
              {/* Cover image */}
              <div
                className={cn(
                  "relative w-full min-w-0 overflow-hidden",
                  showExtendedDetails ? "aspect-[16/10]" : "aspect-[16/9]",
                )}
              >
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#27156F]/60 via-transparent to-transparent' />

                {/* {showExtendedDetails && (
                  <Badge className='absolute left-3 top-3 border-0 bg-white/95 text-[#27156F] shadow-sm backdrop-blur-sm'>
                    {course.skillLevel}
                  </Badge>
                )} */}

                {showExtendedDetails &&
                  typeof course.acceptingApplications === "boolean" && (
                    <ApplicationStatusBadge
                      acceptingApplications={course.acceptingApplications}
                      className='absolute right-3 bottom-3 max-w-[calc(100%-6rem)] text-[10px] sm:text-xs'
                    />
                  )}

                {admin && (
                  <div className='absolute right-2 top-2 flex items-center gap-1'>
                    <Badge
                      variant='secondary'
                      className='border-0 bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm'
                    >
                      <Users className='size-3' />
                      {course.totalEnrolled ?? 0} enrolled
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='secondary'
                          size='icon'
                          className='size-8 rounded-full bg-white/95 shadow-sm backdrop-blur-sm hover:bg-white'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className='size-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/courses/${course.slug}`}
                            target='_blank'
                            className='flex items-center gap-2'
                            aria-label='Open course'
                          >
                            <ExternalLink className='size-4' /> Open
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(course)}
                          className='flex items-center gap-2'
                        >
                          <Pencil className='size-4' /> Update
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='flex flex-1 flex-col gap-4 p-5'>
                <div className='space-y-2'>
                  <h3 className='text-lg font-bold leading-snug text-[#27156F] line-clamp-2 sm:text-xl'>
                    {course.title}
                  </h3>
                  <p
                    className={cn(
                      "leading-relaxed text-gray-600 line-clamp-3",
                      isCoursesPath ? "text-xs sm:text-sm" : "text-sm",
                    )}
                  >
                    {course.description}
                  </p>
                </div>

                {showExtendedDetails && (
                  <div className='grid grid-cols-3 divide-x divide-[#27156F]/10 rounded-xl bg-[#DBEAF6]/50'>
                    <CourseStat
                      icon={<BsPlayBtn className='size-4' />}
                      label='Lessons'
                      value={course.lesson}
                    />
                    <CourseStat
                      icon={<MdAccessTime className='size-4' />}
                      label='Duration'
                      value={course.duration}
                    />
                    <CourseStat
                      icon={<FiBarChart className='size-4' />}
                      label='Level'
                      value={course.skillLevel}
                    />
                  </div>
                )}

                <div className='mt-auto flex flex-wrap gap-3 pt-1 sm:flex-row sm:items-center justify-between'>
                  <div className='flex flex-wra items-center gap-2'>
                    {course.hasCertificate && (
                      <Badge className='border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'>
                        <Award className='size-3' />
                        Certificate
                      </Badge>
                    )}
                    <Badge
                      variant='outline'
                      className='border-[#27156F]/20 bg-[#27156F]/5 text-[#27156F]'
                    >
                      {course.type}
                    </Badge>
                  </div>

                  {admin ? (
                    <Link
                      href={`/courses/${course.slug}`}
                      target='_blank'
                      className='inline-flex whitespace-nowrap w-fit items-center gap-1.5 rounded-full bg-[#E02B20] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9251c]'
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn More
                      <ArrowRight className='size-4' />
                    </Link>
                  ) : (
                    <span className='inline-flex whitespace-nowrap w-fit items-center gap-1.5 rounded-full bg-[#E02B20] px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#c9251c]'>
                      Learn More
                      <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
                    </span>
                  )}
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      ) : (
        <EmptyState title='No Course Found' message='' />
      )}
    </div>
  );
};
