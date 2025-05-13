"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { VscMenu } from "react-icons/vsc";
import { navLinks } from "@/const/links";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";
import { EnrollBtn } from "./EnrollBtn";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className='bg-white font-medium w-full fixed top-0 z-50 text-[#27156F]  px-4 shadow-md text-sm'>
      <div className='max-w-6xl mx-auto flex items-center justify-between h-[80px] lg:h-[106px]'>
        <div className='flex items-center w-full lg:w-auto'>
          <div onClick={handleLinkClick}>
            <Logo />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className='lg:hidden text-[24px] focus:outline-none ml-auto'
          >
            {isOpen ? (
              <AiOutlineClose className='text-[#E02B20]' />
            ) : (
              <VscMenu className='' />
            )}
          </button>
        </div>

        <div
          className={`${
            isOpen
              ? "flex flex-col justify-start items-start gap-5 px-2 h-screen py-6 "
              : "hidden"
          } lg:flex lg:flex-row lg:items-center lg:space-x-6 absolute lg:static top-16 left-0 w-full bg-white lg:w-auto lg:bg-transparent py-4 md:py-0`}
        >
          {navLinks.map((link) => (
            <Link
              href={link.url}
              key={link.label}
              className={`py-2 px-3 hover:text-[#E02B20] transition duration-150 ease-in-out font-medium text-nowrap ${
                pathname === link.url
                  ? "underline text-[#E02B20] underline-offset-8"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}
          <div className='lg:hidden w-fit mt-5 text-center px-2'>
            <EnrollBtn />
          </div>
        </div>
        <div className='hidden lg:flex w-fit  text-center'>
          <EnrollBtn />
        </div>
      </div>
    </nav>
  );
};
