import Link from "next/link";
import React from "react";

export const EnrollBtn = ({ courseId }: { courseId?: string }) => {
  const courseQuery = courseId ? `?course=${encodeURIComponent(courseId)}` : "";
  return (
    <Link
      href={`/enroll${courseQuery}`}
      className="w-[140ppx]  text-center text-nowrap px-6 py-3.5 cursor-pointer bg-[#E02B20] text-[#FFF]  rounded-md hover:bg-[#e02a20ce] duration-300  font-semibold text-sm"
    >
      ENROLL NOW
    </Link>
  );
};
