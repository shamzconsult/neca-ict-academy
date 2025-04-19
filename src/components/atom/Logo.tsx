"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="text-xl font-medium">
    <div className="w-[200px]  h-[50px] lg:w-[223px] lg:h-[80px] relative ">
      <Image
        src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png"
        alt="Neca-logo"
        fill
      />
    </div>
  </Link>
);
