'use client';

import React from 'react'

const ProgramProcess = () => {
  return (
    <section className="relative h-[497px] w-full overflow-hidden mt-[106px]">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source 
          src="https://res.cloudinary.com/daqmbfctv/video/upload/v1741262020/shot-vid_-_Made_with_Clipchamp_hioyh3.mp4" 
          type="video/mp4" 
        />
      </video>
      <div className="absolute inset-0 bg-[#DBEAF6] bg-opacity-15 mix-blend-screen z-10" />      
      <div className="relative h-full container mx-auto px-4 md:px-6 z-20">
        <div className="flex flex-col justify-center items-center h-full max-w-3xl mx-auto text-center">
          <h1 className="text-[#E02B20] text-xl md:text-2xl lg:text-3xl font-bold mb-4">
            Program Process
          </h1>
          
          <h2 className="text-[#27156F] text-xl md:text-2xl lg:text-3xl font-semibold mb-6">
            How to get started!
          </h2>
          
          <p className="text-[#1E1E1E] text-base w-[951px] md:text-xl font-Poppins leading-[150%] h-auto max-w-3xl">
            Taking the first step toward a successful tech career has never been easier. 
            Simply browse our courses, select the one that aligns with your goals, and 
            enroll in our expert-led training. With hands-on projects, mentorship, and 
            career support, you'll gain the skills needed to thrive in the digital world. 
            Whether you're a beginner or looking to upskill, we're here to guide you 
            every step of the way!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgramProcess;
