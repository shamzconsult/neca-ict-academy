"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { AdminLogo } from "./AdminLogo";
import { LogoutModal } from "./LogoutModal";
import { BookOpen, ChartPieIcon, SquareLibrary, UserCog } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className='relative'>
      <div className='flex justify-between items-center p-4 bg-white shadow-sm'>
        <button
          className='lg:hidden focus:outline-none'
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>

        <div className='py-1 flex md:hidden'>
          <AdminLogo />
        </div>
      </div>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/60 bg-opacity-50 z-40'
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 w-[280px] h-screen bg-white flex flex-col justify-between border-r border-gray-200 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div>
          <button
            className='lg:hidden p-4 flex justify-end w-full'
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
          <div className='w-[150px] h-[60px] lg:w-[222px] lg:h-[66px] relative m-4'>
            <Image
              src='https://res.cloudinary.com/dcgghkk7q/image/upload/v1744035920/logo_qrd6my.png'
              alt='Neca-logo'
              fill
            />
          </div>

          <nav className='mt-10'>
            <Link
              href='/admin/dashboard'
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-3 text-sm font-medium mx-1 ${
                isActive("/admin/dashboard")
                  ? "text-blue-600 border-b-2 w-fit border-blue-600"
                  : " hover:text-blue-600"
              }`}
            >
              <ChartPieIcon size={20} className='mr-3' />
              Dashboard
            </Link>

            <Link
              href='/admin/cohorts'
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-3 text-sm font-medium mx-1 ${
                isActive("/admin/cohorts")
                  ? "text-blue-600 border-b-2 w-fit border-blue-600"
                  : " hover:text-blue-600"
              }`}
            >
              <SquareLibrary size={20} className='mr-3' />
              Cohorts
            </Link>
            <Link
              href='/admin/courses'
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-3 text-sm font-medium mx-1 ${
                isActive("/admin/courses")
                  ? "text-blue-600 border-b-2 w-fit border-blue-600"
                  : " hover:text-blue-600"
              }`}
            >
              <BookOpen size={20} className='mr-3' />
              Courses
            </Link>
            <Link
              href='/admin/applicants'
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-3 text-sm font-medium mx-1 ${
                isActive("/admin/applicants")
                  ? "text-blue-600 border-b-2 w-fit border-blue-600"
                  : " hover:text-blue-600"
              }`}
            >
              <UserCog size={20} className='mr-3' />
              Applicants
            </Link>
          </nav>
        </div>

        <div className='mb-6'>
          <button
            onClick={() => setShowModal(true)}
            className='flex items-center px-6 py-3 text-sm text-red-600 hover:text-red-800 w-full cursor-pointer'
          >
            <FiLogOut size={20} className='mr-3' />
            Logout
          </button>
        </div>
      </div>

      <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};
