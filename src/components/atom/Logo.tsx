"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="text-xl font-medium">
    <div className="w-[180px]  h-[30px] lg:w-[270px] lg:h-[37px] relative ">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1740647793/20250212_180601_1_st7yx6.png"
        alt="Neca-logo"
        fill
      />
    </div>
  </Link>
);
