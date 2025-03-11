'use client';


import { SubHeading } from "@/components/atom/headers/SubHeading";
import { Heading } from "@/components/atom/headers/Heading";
import React from 'react'


const ProgramProcess = () => {
  return (
    <section className="relative h-[497px] w-full overflow-hidden mt-23 mb-10 md:mt-[106px]">

      <img
        src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092797/NECAAcadVideo11-Copy-ezgif.com-optimize_n5qfaw.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover" ></img>

      <div className="relative h-full container mx-auto px-4 md:px-6 z-20">
        <div className="flex flex-col justify-center items-center h-full max-w-3xl mx-auto text-center gap-4">
        <SubHeading>Program Process</SubHeading>
          <Heading>  How to get started! </Heading>
          <p className="text-[#1E1E1E] text-center font-Poppins leading-[150%] h-auto max-w-3xl">
          Taking the first step toward a successful tech career has never been easier. Simply browse our 
          courses, select the one that aligns with your goals, and enroll in our expert-led training. With
          hands-on projects, mentorship, and career support, you'll gain the skills needed to thrive in the
          digital world. Whether you're a beginner or looking to upskill, we're here to guide you every step
          of the way!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgramProcess;
