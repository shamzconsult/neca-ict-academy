import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { partners } from "@/const/partners";
import { Heading } from "./headers/Heading";
import { SubHeading } from "./headers/SubHeading";

export const Partners = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 my-20">
      <div className="flex flex-col justify-center items-center text-center gap-3 mb-4">
        <SubHeading>Partners</SubHeading>
        <Heading>Organisations That Trusts Us</Heading>
      </div>
      <div className="max-w-xl mx-auto">
        <Marquee speed={50} pauseOnHover={false}>
          {partners?.map((partner, index) => (
            <div
              key={index}
              className="w-fit h-48  flex justify-center items-center mx-16 "
            >
              <Image
                src={partner?.src}
                alt={partner?.alt}
                width={100}
                height={100}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};
