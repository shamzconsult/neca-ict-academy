'use client';

import React from 'react';
import Image from "next/image";

const ProgramProcessBody = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741686736/Rectangle_4383-1_wooyza.png"
          alt="Background Image 1"
          width={300}
          height={300}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[300px] h-auto"
        />
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741686737/Rectangle_4383_aayodz.png"
          alt="Background Image 2"
          width={300}
          height={300}
          className="hidden md:block absolute top-[50px] left-0 transform -translate-y-1/2 w-[300px] h-auto"
        />
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741686736/Rectangle_31_ytai2s.png"
          alt="Background Image 3"
          width={200}
          height={200}
          className="absolute bottom-0 right-0 w-[200px] h-auto"
        />
      </div>

      <section className="relative max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8 lg:py-20 z-10">
        <div className="space-y-20">
          {/* FIRST CARD */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            <div className="w-full lg:w-1/2">
              <Image
                className="w-[400px] h-auto transition-shadow duration-300"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/_467975184_q7cv5l.png"
                alt="Course Image"
                width={400}
                height={400}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <Image
                className="w-7 h-7"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/Frame_36392_qmw2ww.png"
                alt="Icon"
                width={28}
                height={28}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
                Choose a Course
              </h2>
              <p className="lg:max-w-md mt-3">
                Explore our wide range of tech courses and select the one that best fits your career goals. Whether you're interested in Software Development, Cybersecurity, UI/UX Design, Data Analytics, or Digital Marketing, we have the right program for you.
              </p>
            </div>
          </div>

          {/* SECOND CARD */}
          <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-10">
            <div className="w-full lg:w-1/2">
              <Image
                className="w-[400px] h-auto"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/_358334872_vrvcwo.png"
                alt="Course Image"
                width={400}
                height={400}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <Image
                className="w-7 h-7"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092792/Frame_36392_1_lkmwwe.png"
                alt="Icon"
                width={28}
                height={28}
              />
              <h2 className="text-[21px] sm:text-2xl font-bold text-[#1E1E1E]">
                Register & Enroll
              </h2>
              <p className="lg:max-w-md mt-3">
                Sign up easily through our online portal and secure your spot in the training program. Our enrollment process is simple, and our support team is always available to assist you.
              </p>
            </div>
          </div>

          {/* THIRD CARD */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            <div className="w-full lg:w-1/2">
              <Image
                className="w-[400px] h-auto"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/_359620712_f6wddm.png"
                alt="Course Image"
                width={400}
                height={400}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <Image
                className="w-7 h-7"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092792/Frame_36392_2_rsmljg.png"
                alt="Icon"
                width={28}
                height={28}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
                Learn from Experts
              </h2>
              <p className="lg:max-w-md mt-3">
                Gain hands-on experience through interactive lessons, real-world projects, and mentorship from industry professionals. Our practical approach ensures you develop job-ready skills that employers are looking for.
              </p>
            </div>
          </div>

          {/* FORTH CARD */}
          <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-10">
            <div className="w-full lg:w-1/2">
              <Image
                className="w-[400px] h-auto shadow-xl rounded-2xl bg-white py-2 px-4"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092795/NECA_Web_13_dj9vlt.png"
                alt="Course Image"
                width={400}
                height={400}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <Image
                className="w-7 h-7"
                src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/Frame_36392_3_cusjhi.png"
                alt="Icon"
                width={28}
                height={28}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
                Get Certified & Start Your Career
              </h2>
              <p className="lg:max-w-md mt-3">
                Earn a government-backed certification upon successful completion of your course. With career guidance, job placement support, and networking opportunities, you'll be fully equipped to launch or advance your tech career!
              </p>

              <p className="bg-[#FFC80033] text-[17px] text-[#27156F] leading-relaxed p-2">
                Gain the skills you need to succeed in today's digital world. Your journey to success starts here!
              </p>
              <button className="bg-[#E02B20] text-white py-2 px-4 rounded mt-2 cursor-pointer">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramProcessBody;