"use client";

import { NECA_ICT_ACADEMY_LOGO } from "@/const";
import Link from "next/link";

export const Logo = () => (
  <Link href='/' className='text-xl font-medium'>
    <img src={NECA_ICT_ACADEMY_LOGO} alt='Neca-logo' />
  </Link>
);
