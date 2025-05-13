"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="text-xl font-medium">
    <div className="w-[200px]  h-[50px] lg:w-[220px] lg:h-[73px] relative ">
      <Image
        src="https://res.cloudinary.com/dtryuudiy/image/upload/v1746617205/WhatsApp_Image_2025-03-20_at_22_t7myt8.png"
        alt="Neca-logo"
        fill
      />
    </div>
  </Link>
);
