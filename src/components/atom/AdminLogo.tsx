"use client";

import Image from "next/image";
import React from "react";

export const AdminLogo = () => {
  return (
    <div className="w-[150px] h-[60px] lg:w-[222px] lg:h-[66px] relative m-4">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1742725836/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_b55ms5.png"
        alt="Neca-logo"
        fill
      />
    </div>
  );
};
