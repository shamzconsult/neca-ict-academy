import { SubHeading } from "@/components/atom/headers/SubHeading";
import React from "react";

export const TrackCards = () => {
  return (
    <div className="w-full my-16 lg:mt-28 bg-[#DBEAF6]">
      <div className="max-w-6xl mx-auto p-4 py-20">
        <div className="text-center lg:text-left">
          <SubHeading>Software Engineering Track</SubHeading>
          <p className="md:text-2xl mt-4">
            Join the Software Engineering Track to gain in-depth knowledge of
            software development, from designing and building applications to
            testing and deployment.
          </p>
        </div>
        {/* <CourseCard courses={maincourses} /> */}
      </div>
    </div>
  );
};
