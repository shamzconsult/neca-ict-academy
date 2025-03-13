import { Heading } from "@/components/atom/headers/Heading";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import Image from "next/image";
import React from "react";

export const WhyUs = () => {
  const features = [
    {
      image:
        "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741264010/Neca_web_12_y5ye8z.png",
      title: "100% Government-Backed Training",
      description:
        "Our ICT Academy is fully supported by the government, ensuring high-quality, accessible, and affordable training for all.",
    },
    {
      image:
        "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741264011/NECA_WEB_21_boiule.png",
      title: "Learn from Industry Experts and Mentors",
      description:
        "Gain invaluable knowledge from seasoned professionals with years of experience in the tech industry.",
    },
    {
      image:
        "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741264010/neca_web_9_jxyhtg.png",
      title: "Earn Globally Recognized Certifications",
      description:
        "Our certification programs are designed to meet global standards, ensuring that you stand out to employers in the competitive tech industry.",
    },
  ];
  return (
    <div className="w-full py-20 bg-[#DBEAF6]">
      <div className="max-w-6xl mx-auto px-4">
        <section className="flex flex-col justify-center items-center text-center gap-5">
          <SubHeading>Why Us</SubHeading>
          <Heading>Empowering the Next Generation of Tech Innovators</Heading>
          <p className="lg:text-[20px] max-w-5xl text-center">
            With expert instructors, cutting-edge curriculum, and job placement
            support, we bridge the gap between learning and career success.
            Whether you&apos;re starting your journey or upgrading your skills,
            we provide the tools and opportunities to unlock your full
            potential.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6 px-4 lg:px-0 mt-8 md:mt-16 lg:mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-b-xl shadow-lg overflow-hidden h-[340px]"
            >
              <div className=" h-[184px] w-[379px]  relative ">
                <Image src={feature.image} alt="features-img" fill />
              </div>
              <div className="p-3 my-4">
                <h3 className="text-[16px]  text-[#1E1568]">{feature.title}</h3>
                <p className="text-[14px] mt-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
