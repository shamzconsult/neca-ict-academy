"use client";

import Image from "next/image";
import React from "react";

export const AdminLogo = () => {
  return (
    <div className="w-[178px] h-[56px] relative ">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1742729184/Frame_1618869872_llfnai.png"
        alt="Neca-logo"
        fill
      />
    </div>
  );
};
