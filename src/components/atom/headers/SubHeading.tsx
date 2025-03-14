import { Sue_Ellen_Francisco } from "next/font/google";
import React from "react";

export const suellen = Sue_Ellen_Francisco({
  subsets: ["latin"],
  weight: "400",
});

export const SubHeading = ({ children }: { children: string }) => {
  return (
    <h1
      className={`font-bold text-[36px] text-[#E02B20] leading-normal md:leading-[50px] ${suellen.className}`}
    >
      {children}
    </h1>
  );
};
