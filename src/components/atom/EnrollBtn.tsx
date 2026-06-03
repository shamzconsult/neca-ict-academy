import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export const EnrollBtn = ({
  courseId,
  acceptingApplications,
}: {
  courseId?: string;
  acceptingApplications?: boolean;
}) => {
  // we now have multiple cohorts that can be active, so we don't know which cohort a course belong at this point since courses can belong to several cohort
  // const courseQuery = courseId ? `?course=${encodeURIComponent(courseId)}` : "";

  if (acceptingApplications === false) {
    return (
      <span
        aria-disabled
        className={cn(
          "inline-block text-center text-nowrap px-6 py-3.5 cursor-not-allowed",
          "bg-gray-500 text-white rounded-md font-semibold text-sm",
        )}
      >
        Applications closed
      </span>
    );
  }

  return (
    <Link
      href={`/enroll`}
      className='text-center text-nowrap px-6 py-3.5 cursor-pointer bg-[#E02B20] text-[#FFF] rounded-md hover:bg-[#e02a20ce] duration-300 font-semibold text-sm'
    >
      ENROLL NOW
    </Link>
  );
};
