import { EnrollBtn } from "@/components/atom/EnrollBtn";
import { Heading } from "@/components/atom/headers/Heading";
import Image from "next/image";
import React from "react";

export const CourseHeroSection = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:justify-between w-full items-center lg:flex-row gap-8 mt-32  px-4 lg:px-0">
      <section className="flex flex-col justify-center text-center lg:text-left max-w-2xl lg:max-w-1/2">
        <Heading>Gain In-Demand Tech Skills with Expert Training</Heading>
        <p className="my-[29px] lg:max-w-md md:text-[20px]">
          At Neca&#8217;s ICT Academy, we offer a range of industry-focused
          courses designed to equip you with the skills needed to thrive in
          today&#8217;s digital world.
        </p>
        <div>
          <EnrollBtn />
        </div>
      </section>
      <section className="w-full flex justify-center md:max-w-1/2">
        <div className=" w-full h-[400px]  relative   md:h-[405px] md:w-[582px]  ">
          <Image
            src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1741695429/Frame_1618869617_icfxaa.png"
            alt="hero-image"
            fill
            className="rounded-3xl"
          />
        </div>
      </section>
    </div>
  );
};
