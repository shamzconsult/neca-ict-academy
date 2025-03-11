'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { SubHeading } from "@/components/atom/headers/SubHeading";

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-6xl w-full px-0 md:max-w-6xl md:mx-auto md:px-4 py-8">
            <div className="flex flex-col lg:flex-row bg-white overflow-hidden">
                <div className="hidden lg:w-1/2 lg:block">
                    <Image
                        src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092798/0_LmGSx7loZgQCyE-a_iiam6w.png"
                        alt="FAQ Image"
                        className="w-[537px] h-[1117px] object-cover rounded-[21.53px]"
                    />
                </div>
                <div className="w-full lg:w-1/2 lg:text-left p-2 md:p-6 flex flex-col text-center">
                    <SubHeading>FAQ</SubHeading>
                    <h2 className="text-center text-[#27156F] mt-4 mb-4 lg:text-left lg:text-[25px] font-bold">Got Questions? We've Got Answers!</h2>
                    <p className="lg:max-w-md mt-3 text-center lg:text-left mb-3">
                        We understand that you may have questions about our courses, enrollment process, certifications, and more. That's why we've put together this FAQ section to provide clear answers and help you make informed decisions. Explore the most common inquiries below, and if you need further assistance, our support team is always here to help!
                    </p>

                    <div className="space-y-4 w-full max-w-2xl">
                        {[
                            { question: "Where can I watch?", answer: "Our courses are open to beginners, professionals, and anyone looking to build a career in tech. Whether you have prior experience or are just starting, we have a program suited for you." },
                            { question: "Are the courses government-backed?", answer: "Yes, our courses are recognized and backed by relevant government authorities." },
                            { question: "Do I need prior experience to enroll?", answer: "No, our courses are designed for both beginners and professionals." },
                            { question: "How long do the courses take?", answer: "The duration varies depending on the course, but most courses take between 4 to 12 weeks." },
                            { question: "Will I receive a certificate after completion?", answer: "Yes, you will receive a certificate upon successful completion of the course." },
                            { question: "Is there career support after training?", answer: "Yes, we provide career support, including job placement assistance and resume building." },
                            { question: "How do I get started?", answer: "Simply choose a course, enroll, and start learning! Our team is here to guide you every step of the way." },
                        ].map((faq, index) => (
                            <div key={index} className="accordion border-b-3 border-gray-200 pb-4 pt-4">
                                <button
                                    className="accordion-toggle w-full flex justify-between items-center text-left focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className="text-[#1E1E1E] font-bold text-[16px]">{faq.question}</span>
                                    <span className="accordion-icon text-[#27156F] text-[20px]">{activeIndex === index ? '×' : '+'}</span>
                                </button>
                                {activeIndex === index && (
                                    <div className="accordion-content mt-2 text-[#525252] text-[14px]">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-[20px] font-bold text-[#27156F] mt-8 text-center lg:text-left">Need More information?</h2>

                    <div className="mt-5">
                        <p className="text-[#525252] text-xl lg:text-[18px] text-center lg:text-left">
                            Can't find the answer you're looking for? Please contact our customer service.
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <button className="mt-4 px-4.5 py-3 lg:px-5 lg:py-3 bg-[#E02B20] text-white rounded-md hover:bg-[#cc1912] focus:outline-none cursor-pointer">CONTACT US</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;