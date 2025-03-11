"use client";

import { CourseType } from "@/const/courses";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPlayBtn } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";

export const CourseCard = ({
  courses,
  searchTerm,
}: {
  courses: CourseType[];
  searchTerm?: string;
}) => {
  const pathname = usePathname();
  const isCoursesPath = pathname === "/courses";

  return (
    <div
      className={`max-w-6xl mx-auto grid justify-center gap-8 mt-8 ${
        isCoursesPath
          ? "grid-cols-1 md:grid-cols-2 lg:space-x-16 px-4  "
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <Link
            href=""
            key={index}
            className={`bg-white border border-[#C4C4C480] rounded-xl shadow-lg overflow-hidden p-4 text-left ${
              isCoursesPath
                ? "w-full md:w-[350px] lg:w-[400px] hover:cursor-pointer hover:bg-[#DBEAF6]"
                : ""
            }`}
          >
            <div
              className={`  relative p-3 ${
                isCoursesPath
                  ? "w-full md:w-[340px]  lg:w-[360px] h-[250px] lg:h-[200px]"
                  : "w-full h-[250px] lg:h-[189px] lg:w-[331px]"
              }`}
            >
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="rounded-md"
              />
            </div>

            <h3 className="text-lg font-bold text-[#27156F] mt-4">
              {course.title}
            </h3>
            <div>
              {isCoursesPath && (
                <p className="font-bold mt-2 text-sm">About The Course</p>
              )}
              <p
                className={`mt-1 ${isCoursesPath ? "text-[12px]" : " text-sm"}`}
              >
                {course.description}
              </p>
              <div>
                {course.lessons !== undefined && (
                  <div className="text-sm mt-3 ">
                    <h3 className="font-bold mb-2 text-sm">Course Details</h3>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg">
                        <p className="font-semibold">Lesson</p>
                        <div className="flex gap-2  items-center ">
                          <span>
                            <BsPlayBtn />
                          </span>
                          <span className="text-nowrap">{course.lessons}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center px-4 py-1.5 border border-[#7272721A] rounded-lg">
                        <p className="font-semibold">Duration</p>
                        <div className="flex gap-2 items-center ">
                          <span>
                            <MdAccessTime />
                          </span>
                          <span className="text-nowrap">{course.duration}</span>
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
              {course.ratings !== undefined && (
                <p>
                  <span className="font-bold">{course.ratings}</span>⭐{" "}
                  <span>({course.reviews})</span>
                </p>
              )}
            </div>
            <div className="flex justify-between items-end mt-3">
              {isCoursesPath && (
                <div className="flex divide-x divide-[#525252] space-x-2  text-xs">
                  <span className="px-1">{course.skillLevel}</span>
                  <span className="px-1">Certificate</span>
                  <span className="px-1">{course.mode}</span>
                </div>
              )}
              <Link
                href=""
                className="text-[#E02B20]  mt-3 inline-flex items-center hover:underline-offset-4 hover:underline"
              >
                Learn More <span className="ml-2">→</span>
              </Link>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-center w-full  font-bold py-24">
          No results found
          <span className="text-red-400 mx-1"> &#34;{searchTerm}&#34; </span>
        </p>
      )}
    </div>
  );
};
