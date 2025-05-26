import React from "react";
import Marquee from "react-fast-marquee";
import { partners } from "@/const/partners";
import { Heading } from "./headers/Heading";
import { SubHeading } from "./headers/SubHeading";

export const Partners = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 my-20">
      <div className="flex flex-col justify-center items-center text-center gap-3 mb-6">
        <SubHeading>Partners</SubHeading>
        <Heading>Organisations That Trusts Us</Heading>
      </div>
      <Marquee speed={50} pauseOnHover={false}>
        <div className="flex gap-3 justify-center items-center">
          {partners?.map((partner, index) => (
            <div
              key={index}
              className="w-64 h-36  flex justify-center items-center mx-6 "
            >
              <img
                src={partner?.src}
                alt={partner?.alt}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};
