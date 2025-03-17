"use client";

import { MileStone } from "@/components/atom/MileStone";
import { HomeHerosection } from "./HomeHerosection";
import { MissionAndVision } from "./MissionAndVision";
import { WhyUs } from "./WhyUs";
import { Partners } from "@/components/atom/Partners";
import { FeaturedCourses } from "./FeaturedCourses";
import { Testimonials } from "@/components/atom/Testimonials";

export const HomePage = () => {
  return (
    <div className="">
      <HomeHerosection />
      <MileStone />
      <MissionAndVision />
      <WhyUs />
      <Partners />
      <FeaturedCourses />
      <Testimonials />
    </div>
  );
};
