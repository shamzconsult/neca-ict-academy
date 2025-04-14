"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="text-xl font-medium">
    <div className="w-[200px]  h-[50px] lg:w-[222px] lg:h-[66px] relative ">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1744035920/logo_qrd6my.png"
        alt="Neca-logo"
        fill
      />
    </div>
  </Link>
);
