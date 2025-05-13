"use client";

import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Logo } from "./Logo";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const today = new Date();

  const handleSubmit = () => {
    if (!email) {
      return;
    }
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <footer className='bg-[#27156F] text-white py-12 px-6 md:px-16'>
      <div className='max-w-6xl mx-auto '>
        <div className='bg-white p-2 w-fit mb-3 lg:mb-6'>
          <Logo />
        </div>
        <section className='flex flex-col lg:flex-row justify-evenly gap-8 lg:gap-24'>
          <div className=' max-w-[270px]'>
            <h3 className='mb-2 font-semibold text-nowrap'>Lagos Branch</h3>
            <p className='text-sm leading-[21px]'>
              NECA House, Plot A2, Hakeem Balogun Street, Central Business
              District, Alausa, Ikeja, Lagos.
              <br />
              08160600305, 08131191568
            </p>
            <h3 className='mb-2 font-semibold mt-8 text-nowrap'>
              Abuja Branch
            </h3>
            <p className='text-sm leading-[21px]'>
              8th Floor, Unity Bank House, Plot 785, Herbert Macaulay Way,
              Central Business District, Abuja
              <br />
              07032760322, 07089116429
            </p>
          </div>

          <div className=''>
            <h3 className='font-semibold mb-3 text-nowrap'>Quick Menu</h3>
            <div className='text-sm flex flex-col space-y-2'>
              <Link
                href='/'
                className='hover:underline underline-offset-4 duration-150'
              >
                Home
              </Link>
              <Link
                href='/courses'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Course Overview
              </Link>
              <Link
                href='/programprocess'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Program Process
              </Link>
              <Link
                href='/faq'
                className='hover:underline underline-offset-4 duration-150 '
              >
                FAQ
              </Link>
              <Link
                href='/contact'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className=''>
            <h3 className='font-semibold mb-3'>Links</h3>
            <div className='text-sm flex flex-col space-y-2'>
              <Link
                href='/gallery'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Gallery
              </Link>
              <Link
                href='/enroll'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Enroll Now
              </Link>
              {/* <Link
                href='/'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Privacy Policy
              </Link>
              <Link
                href='/'
                className='hover:underline underline-offset-4 duration-150 text-nowrap'
              >
                Terms of Use
              </Link> */}
            </div>
          </div>

          <div className=''>
            <p className='text-sm mb-3'>
              Subscribe to our newsletter and be the first to know about our
              updates
            </p>
            {isSubmitted ? (
              <h2 className='text-lg font-semibold p-2 bg-[#E02B20]'>
                You&#8217;ve subscribed to our newsletter Successfully🎉🎉
              </h2>
            ) : (
              <div className='flex flex-col md:flex-row gap-3 text-sm'>
                <div className='flex items-center space-x-2 w-full md:w-[65%] bg-white px-2.5 py-4'>
                  <MdEmail className='text-[#27156F] w-[24px] h-[24px]' />
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter Email Address'
                    className='text-black outline-none w-full '
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className='bg-[#E02B20] hover:bg-[#e02a20ce] duration-300 text-white text-center  px-2 py-2 w-full md:w-[35%] cursor-pointer hover:shadow-xl'
                >
                  Subscribe
                </button>
              </div>
            )}

            <div className='flex flex-col md:flex-row md:items-center gap-4 mt-4 lg:mt-8 text-sm'>
              <h3 className='font-semibold text-nowrap'>Follow Us:</h3>
              <div className='flex space-x-3 '>
                <a
                  href=''
                  className='bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full'
                >
                  <BsTwitterX className='text-sm text-[#27156F]  ' />
                </a>
                <a
                  href=''
                  className='bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full'
                >
                  <FaFacebookF className='text-sm text-[#27156F]  ' />
                </a>
                <a
                  href=''
                  className='bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full'
                >
                  <FaLinkedinIn className='text-sm  text-[#27156F] ' />
                </a>
                <a
                  href=''
                  className='bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full'
                >
                  <FaInstagram className='text-sm  text-[#27156F] ' />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className='text-center text-sm mt-8  pt-4 lg:mt-16'>
        Copyright {today.getFullYear()} | NECA. All Rights Reserved
      </div>
    </footer>
  );
};
