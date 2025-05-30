"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import Link from "next/link";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='max-w-6xl w-full px-0 lg:pt-20 md:max-w-8xl md:mx-auto md:px-0 py-8'>
      <div className='flex flex-col lg:flex-row bg-white items-center justify-evenly overflow-hidden gap-15 h-full'>
        <div className='hidden lg:w-full lg:block h-full'>
          <Image
            src='https://res.cloudinary.com/dtryuudiy/image/upload/v1746617413/0_LmGSx7loZgQCyE-a_iiam6w_ceqsbv.png'
            alt='FAQ Image'
            width={537}
            height={1117}
            className='w-[525px] max-h-[996px] object-cover rounded-b-[21.53px] rounded-t-[5px]'
          />
        </div>
        <div className='w-full lg:w-full lg:text-left md:p-6 flex flex-col h-full flex-grow'>
          <SubHeading>FAQ</SubHeading>
          <h2 className='text-[#27156F] mt-4 mb-2 lg:text-left lg:text-[25px] font-bold'>
            Got Questions? We&apos;ve Got Answers!
          </h2>
          <p className='lg:max-w-full mt-2 lg:text-left mb-4 text'>
            We understand that you may have questions about our courses,
            enrollment process, certifications, and more. That&apos;s why
            we&apos;ve put together this FAQ section to provide clear answers
            and help you make informed decisions. Explore the most common
            inquiries below, and if you need further assistance, our support
            team is always here to <br /> help!
          </p>

          <div className='space-y-2 w-full max-w-2xl mt-2'>
            {[
              {
                question: "Where can I watch?",
                answer:
                  "Our courses are open to beginners, professionals, and anyone looking to build a career in tech. Whether you have prior experience or are just starting, we have a program suited for you.",
              },
              {
                question: "Are the courses government-backed?",
                answer:
                  "Yes, our courses are recognized and backed by relevant government authorities.",
              },
              {
                question: "Do I need prior experience to enroll?",
                answer:
                  "No, our courses are designed for both beginners and professionals.",
              },
              {
                question: "How long do the courses take?",
                answer:
                  "The duration varies depending on the course, but most courses take between 4 to 12 weeks.",
              },
              {
                question: "Will I receive a certificate after completion?",
                answer:
                  "Yes, you will receive a certificate upon successful completion of the course.",
              },
              {
                question: "Is there career support after training?",
                answer:
                  "Yes, we provide career support, including job placement assistance and resume building.",
              },
              {
                question: "How do I get started?",
                answer:
                  "Simply choose a course, enroll, and start learning! Our team is here to guide you every step of the way.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`accordion border-b-3 border-gray-200 pb-4 pt-4 ${index === 0 ? "border-t-3 border-gray-200" : ""}`}
              >
                <button
                  className='accordion-toggle w-full flex justify-between items-center text-left focus:outline-none cursor-pointer'
                  onClick={() => toggleAccordion(index)}
                >
                  <span className='text-[#1E1E1E] font-semibold text-sm lg:text-[17px]'>
                    {faq.question}
                  </span>
                  <span className='accordion-icon text-[#27156F] text-[20px]'>
                    {activeIndex === index ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='18' y1='6' x2='6' y2='18'></line>
                        <line x1='6' y1='6' x2='18' y2='18'></line>
                      </svg>
                    ) : (
                      "+"
                    )}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className='accordion-content mt-2 text-[#525252] text-[12px]'>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className='text-[18px] font-bold text-[#27156F] mt-10 lg:mt-5 text-center lg:text-left'>
            Need More information?
          </h2>

          <div className='mt-5'>
            <p className='text-[#525252] text-xl lg:text-[17px] text-center lg:text-left'>
              Can&apos;t find the answer you&apos;re looking for? Please contact
              our customer service.
            </p>
            <div className='flex justify-center lg:justify-start'>
              <Link
                href='/contact'
                className='mt-4 px-4.5 py-3 lg:px-5 lg:py-2.5 bg-[#E02B20] text-white rounded-md hover:bg-[#cc1912] focus:outline-none cursor-pointer'
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
