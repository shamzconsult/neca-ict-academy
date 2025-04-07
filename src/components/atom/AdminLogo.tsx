"use client";

import Image from "next/image";
import React from "react";

export const AdminLogo = () => {
  return (
    <div className="w-[150px] h-[60px] lg:w-[222px] lg:h-[66px] relative m-4">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1744035920/logo_qrd6my.png"
        alt="Neca-logo"
        fill
      />
    </div>
  );
};
