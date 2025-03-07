import React from "react";

export const Heading = ({ children }: { children: string }) => {
  return (
    <h1 className="font-bold text-[24px] md:text-[36px] text-[#27156F] leading-normal md:leading-[50px]">
      {children}
    </h1>
  );
};
