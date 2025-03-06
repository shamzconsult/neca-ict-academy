'use client';

import React, { useState } from 'react';

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full px-0 md:container md:mx-auto md:px-4 py-8">
            <div className="flex flex-col lg:flex-row bg-white overflow-hidden">
                <div className="hidden lg:w-1/2 lg:block">
                    <img
                        src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092798/0_LmGSx7loZgQCyE-a_iiam6w.png"
                        alt="FAQ Image"
                        className="w-[537px] h-[1117px] object-cover rounded-[21.53px]"
                    />
                </div>
                <div className="w-full lg:w-1/2 p-2 md:p-6 flex flex-col">
                    <h1 className="text-3xl mb-4 text-[#E02B20] inconsolata px-2 md:px-0">FAQ</h1>
                    <h2 className="text-2xl font-bold mb-4 text-[#27156F] lg:text-3xl px-2 md:px-0">Got Questions? We've Got Answers!</h2>
                    <p className="mb-6 text-[#525252] text-[20px] lg:text-xl px-2 md:px-0">
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
                                    <span className="text-[#1E1E1E] font-bold text-[18px]">{faq.question}</span>
                                    <span className="accordion-icon text-[#27156F] text-[20px]">{activeIndex === index ? '×' : '+'}</span>
                                </button>
                                {activeIndex === index && (
                                    <div className="accordion-content mt-2 text-[#525252] text-[16px]">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-[20px] font-bold text-[#27156F] mt-8">Need More information?</h2>

                    <div className="mt-8">
                        <p className="text-[#525252] text-xl lg:text-[20px]">Can't find the answer you're looking for? Please contact our customer service.</p>
                        <button className="mt-4 px-4.5 py-3 lg:px-5.5 lg:py-3.5 bg-[#E02B20] text-white rounded-md hover:bg-[#cc1912] focus:outline-none">CONTACT US</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;