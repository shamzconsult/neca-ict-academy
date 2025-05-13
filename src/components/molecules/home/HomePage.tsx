"use client";

import { MileStone } from "@/components/atom/MileStone";
import { MissionAndVision } from "./MissionAndVision";
import { WhyUs } from "./WhyUs";
import { Partners } from "@/components/atom/Partners";
import { FeaturedCourses } from "./FeaturedCourses";
import { Testimonials } from "@/components/atom/Testimonials";
import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";
import { CourseType } from "@/types";
import { HomeHeroSection } from "./HomeHerosection";
import { AdvertOverlay } from "@/components/atom/AdvertOverlay";

export const HomePage = ({ courses }: { courses: CourseType[] }) => {
  return (
    <>
      <AdvertOverlay />
      <Navbar />
      <HomeHeroSection />
      <MileStone />
      <MissionAndVision />
      <WhyUs />
      <Partners />
      <FeaturedCourses courses={courses} />
      <Testimonials />
      <Footer />
    </>
  );
};
