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
import { useState } from "react";

export const HomePage = ({ courses }: { courses: CourseType[] }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
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

      {/* Floating Video Preview Button */}
      <button
        onClick={() => setIsVideoOpen(true)}
        className='fixed bottom-6 right-6 z-[9999] rounded-md shadow-lg bg-white border border-[#27156F] hover:scale-105 transition-transform overflow-hidden w-16 h-16 flex items-center justify-center group'
        aria-label='Watch our video'
      >
        <img
          src='https://img.youtube.com/vi/t7MZk4PnTUI/hqdefault.jpg'
          alt='Video Preview'
          className='object-cover w-full h-full group-hover:opacity-80'
        />
        <span className='absolute inset-0 flex items-center justify-center'>
          <svg
            className='w-10 h-10 text-[#E02B20] drop-shadow'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M8 5v14l11-7z' />
          </svg>
        </span>
      </button>

      {/* Modal */}
      {isVideoOpen && (
        <div
          className='fixed inset-0 z-[99999] flex items-center justify-center bg-black/70'
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className='relative bg-black rounded-lg shadow-lg w-full max-w-7xl aspect-video'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className='absolute top-2 right-2 text-white text-2xl z-10'
              aria-label='Close video'
            >
              &times;
            </button>
            <iframe
              width='100%'
              height='100%'
              src='https://www.youtube.com/embed/t7MZk4PnTUI?autoplay=1'
              title='YouTube video player'
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen
              className='rounded-lg w-full h-full'
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};
