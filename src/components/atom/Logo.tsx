"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="text-xl font-medium">
    <div className="w-[200px]  h-[50px] lg:w-[220px] lg:h-[73px] relative ">
      <Image
        src="https://res.cloudinary.com/dcgghkk7q/image/upload/v1746161757/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_2_jnspv7.png"
        alt="Neca-logo"
        fill
      />
    </div>
  </Link>
);
