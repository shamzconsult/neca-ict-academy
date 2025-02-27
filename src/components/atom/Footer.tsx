import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export const Footer = () => {
  const today = new Date();
  return (
    <footer className="bg-[#27156F] text-white py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto ">
        <section className="grid grid-cols-1 md:grid-cols-4   gap-8">
          <div>
            <h3 className="mb-2 font-medium ">Lagos Branch</h3>
            <p className="text-sm leading-[21px]">
              NECA House, Plot A2, Hakeem Balogun Street, Central Business
              District, Alausa, Ikeja, Lagos.
              <br />
              08160600305, 08131191568
            </p>
            <h3 className="mb-2 font-medium mt-8">Abuja Branch</h3>
            <p className="text-sm leading-[21px]">
              8th Floor, Unity Bank House, Plot 785, Herbert Macaulay Way,
              Central Business District, Abuja
              <br />
              09060008293, 07089116429
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-3">Quick Menu</h3>
            <div className="text-sm flex flex-col space-y-2">
              <Link
                href="/"
                className="hover:underline underline-offset-4 duration-150"
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="hover:underline underline-offset-4 duration-150"
              >
                Course Overview
              </Link>
              <Link
                href="/program"
                className="hover:underline underline-offset-4 duration-150"
              >
                Program Process
              </Link>
              <Link
                href="/faq"
                className="hover:underline underline-offset-4 duration-150"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="hover:underline underline-offset-4 duration-150"
              >
                Contact Us
              </Link>
              <Link
                href=""
                className="hover:underline underline-offset-4 duration-150"
              >
                Enroll Now
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Links</h3>
            <div className="text-sm flex flex-col space-y-2">
              <Link
                href="/privacy"
                className="hover:underline underline-offset-4 duration-150"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:underline underline-offset-4 duration-150"
              >
                Terms of Use
              </Link>
              <Link
                href=""
                className="hover:underline underline-offset-4 duration-150"
              >
                Downloads
              </Link>
              <Link
                href="/member"
                className="hover:underline underline-offset-4 duration-150"
              >
                Membership
              </Link>
              <Link
                href=""
                className="hover:underline underline-offset-4 duration-150"
              >
                Subscriptions
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm mb-3">
              Subscribe to our newsletter and be the first to know about our
              updates
            </p>
            <div className="flex gap-3 text-sm">
              <div className="flex items-center space-x-2 w-[65%] bg-white p-1 py-2.5">
                <FiMail className="text-[#27156F]" />
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="text-black outline-none w-full "
                />
              </div>
              <button className="bg-[#E02B20] text-white text-center  px-2 py-2 w-[35%] cursor-pointer hover:shadow-xl">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 lg:mt-8 text-sm">
              <h3 className="font-medium">Follow Us:</h3>
              <div className="flex space-x-3 ">
                <a
                  href=""
                  className="bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full"
                >
                  <BsTwitterX className="text-sm text-[#27156F]  " />
                </a>
                <a
                  href=""
                  className="bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full"
                >
                  <FaFacebookF className="text-sm text-[#27156F]  " />
                </a>
                <a
                  href=""
                  className="bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full"
                >
                  <FaLinkedinIn className="text-sm  text-[#27156F] " />
                </a>
                <a
                  href=""
                  className="bg-white hover:bg-[#E02B20] duration-300 ease-in-out p-2 rounded-full"
                >
                  <FaInstagram className="text-sm  text-[#27156F] " />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center text-sm mt-8  pt-4 lg:mt-16">
        Copyright {today.getFullYear()} | NECA. All Rights Reserved
      </div>
    </footer>
  );
};
