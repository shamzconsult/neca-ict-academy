import { EnrollBtn } from "@/components/atom/EnrollBtn";
import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { CourseType } from "@/types";
import Image from "next/image";
import React from "react";

export const CoursePreviewHero = ({
  courseData: { _id, title, coverImage, acceptingApplications },
}: {
  courseData: CourseType;
}) => {
  return (
    <div className='mx-auto max-w-6xl'>
      <section className='flex w-full flex-col items-center gap-8 px-4 pt-44 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-0'>
        <div className='flex max-w-2xl flex-col justify-center gap-6 text-center lg:min-w-0 lg:flex-1 lg:text-left'>
          <Heading>{`Learn ${title} & build real-world applications.`}</Heading>
          <p className='md:text-[20px] lg:max-w-xl'>
            Master comprehensive skill sets and gain practical experience by
            creating real-world solutions from concept to completion.
          </p>
          <div className='mt-4'>
            <EnrollBtn courseId={_id} acceptingApplications={acceptingApplications} />
          </div>
        </div>

        <div className='w-full max-w-xl shrink-0 rounded-xl bg-white p-3 shadow-sm lg:max-w-[540px] lg:flex-1'>
          <div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#DBEAF6]/20'>
            <Image
              src={coverImage}
              alt={title}
              fill
              priority
              sizes='(max-width: 1024px) 100vw, 540px'
              className='object-cover rounded'
            />
          </div>
        </div>
      </section>
      <section className='max-w-5xl mx-auto flex flex-col justify-center items-center text-center gap-2 mt-8 md:mt-24 px-2 lg:px-0'>
        <SubHeading>About The Course</SubHeading>
        <h1 className='font-bold text-[24px] md:text-[36px] text-[#27156F] leading-normal md:leading-[50px]'>
          Build Your Future in <span className='mx-1'>{title}</span>
        </h1>
        <p className='md:text-[20px] text-center px-4 lg:px-0'>
          This<span className='mx-1'>{title}</span>course is designed to provide
          you with a solid foundation and a broad understanding of core
          concepts. You&#8217;ll explore fundamental principles, essential
          tools, and best practices through immersive projects. Whether
          you&#8217;re new to the subject or aiming to refine your expertise,
          this course will equip you to tackle real-world challenges and create
          impactful solutions with confidence
        </p>
      </section>
    </div>
  );
};
