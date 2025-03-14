"use client";

import { SubHeading } from "@/components/atom/headers/SubHeading";
import { Heading } from "@/components/atom/headers/Heading";
import React from "react";
// import Image from "next/image";

const ProgramProcess = () => {
  return (
    <section className="relative min-h-[497px] w-full overflow-hidden mt-23 mb-10 md:mt-[106px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      >
        <source
          src="https://res.cloudinary.com/daqmbfctv/video/upload/v1741262020/shot-vid_-_Made_with_Clipchamp_hioyh3.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[#DBEAF6] opacity-60"></div>
      <div className="relative h-full container mx-auto px-4 md:px-6 z-20">
        <div className="flex flex-col justify-center items-center h-full max-w-3xl mx-auto text-center gap-4 py-12">
          <SubHeading>Program Process</SubHeading>
          <Heading>How to get started!</Heading>
          <p className="text-[#1E1E1E] text-center text-[18px] text-base leading-[140%] tracking-wide h-auto max-w-6xl">
            Taking the first step toward a successful tech career has never been
            easier. Simply browse our courses, select the one that aligns with
            your goals, and enroll in our expert-led training. With hands-on
            projects, mentorship, and career support, you&apos;ll gain the
            skills needed to thrive in the digital world. Whether you&apos;re a
            beginner or looking to ups-kill, we&apos;re here to guide you every
            step of the way!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgramProcess;
