import { SubHeading } from "@/components/atom/headers/SubHeading";
import Image from "next/image";

export const MissionAndVision = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-start items-center gap-8 lg:gap-16 my-16 lg:my-28 px-4 lg:px-0">
      <section className=" h-[300px] md:h-[525px] w-full  lg:w-[633px] relative ">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1743684413/Group_1_wnigfq.png"
          alt="mission&vission"
          fill
        />
      </section>
      <section className="flex flex-col justify-between  gap-10 md:max-w-2xl lg:max-w-1/2 px-3 md:text-[20px]">
        <div className="text-center lg:text-left">
          <SubHeading>Mission Statement</SubHeading>
          <p className="lg:max-w-md mt-3 ">
            To empower individuals with world-class ICT skills, bridging the
            digital divide and fostering sustainable employment opportunities.
          </p>
        </div>
        <div className="text-center lg:text-left">
          <SubHeading>Vision Statement</SubHeading>
          <p className="lg:max-w-md mt-3">
            To be the leading hub for technology-driven capacity building,
            producing globally competitive talents
          </p>
        </div>
      </section>
    </div>
  );
};
