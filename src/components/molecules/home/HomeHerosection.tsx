import { EnrollBtn } from "@/components/atom/EnrollBtn";
import { Heading } from "@/components/atom/headers/Heading";
import Image from "next/image";

export const HomeHerosection = () => {
  return (
    <div className=" max-w-6xl mx-auto flex flex-col justify-center items-center lg:flex-row lg:justify-between gap-8 mt-32  px-4 lg:px-0">
      <section className="flex flex-col justify-center text-center lg:text-left max-w-2xl lg:max-w-1/2">
        <Heading>Empowering the Future Through Digital Skills</Heading>
        <p className="my-[29px] lg:max-w-md md:text-[20px]">
          Our hands-on training programs, expert-led courses, and globally
          recognized certifications are designed to equip you with the knowledge
          and experience needed to thrive in today&#8217;s fast-paced tech
          industry.
        </p>
        <div>
          <EnrollBtn />
        </div>
      </section>
      <section className="flex justify-between gap-8 w-full lg:max-w-1/2">
        <div className="lg:h-[456px]  relative hidden md:flex md:w-1/2 lg:w-[290px] ">
          <Image
            src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1743684060/Neca_web_6_zsloyh.png"
            alt="hero-image"
            fill
            className="object-fit"
          />
        </div>
        <div className="flex flex-col justify-between w-full gap-4 md:w-1/2">
          <div className=" h-[300px] md:w-full   lg:h-[205px] relative ">
            <Image
              src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1743744742/NECA_Web_13_fniqfh.jpg"
              alt="hero-image"
              className="rounded-lg border-4 border-white object-cover"
              fill
            />
          </div>
          <div className=" h-[300px] md:w-full  lg:h-[205px]  relative ">
            <Image
              src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1743744967/NECA_Web_16_ckl8pl.jpg"
              alt="hero-image"
              className="rounded-lg border-4 border-white object-cover"
              fill
            />
          </div>
        </div>
      </section>
    </div>
  );
};
