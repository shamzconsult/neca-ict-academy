import Link from "next/link";
import React from "react";

export const EnrollBtn = () => {
  return (
    <Link
      href="/enroll"
      className="w-[140ppx]  text-center text-nowrap px-6 py-3.5 cursor-pointer bg-[#E02B20] text-[#FFF]  rounded-md hover:bg-[#e02a20ce] duration-300  font-semibold text-sm"
    >
      ENROLL NOW
    </Link>
  );
};
