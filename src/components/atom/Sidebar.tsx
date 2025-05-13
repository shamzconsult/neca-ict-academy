"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { AdminLogo } from "./AdminLogo";
import { LogoutModal } from "./LogoutModal";
import { BookOpen, ChartPieIcon, SquareLibrary } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className='relative'>
      {/* Mobile Top Bar */}
      <div className='flex justify-between items-center p-4 bg-white shadow-sm lg:hidden'>
        <button className='focus:outline-none' onClick={() => setIsOpen(true)}>
          <FiMenu size={24} />
        </button>
        <div className='py-1 flex md:hidden'>
          <AdminLogo />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/60 z-40'
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[260px] h-screen bg-white flex flex-col justify-between border-r border-gray-200 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div>
          {/* Close button for mobile */}
          <button
            className='lg:hidden p-4 flex justify-end w-full'
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
          {/* Logo */}
          <div className='w-[150px] h-[60px] lg:w-[222px] lg:h-[66px] relative m-4'>
            <Image
              src='https://res.cloudinary.com/dcgghkk7q/image/upload/v1744035920/logo_qrd6my.png'
              alt='Neca-logo'
              fill
            />
          </div>
          {/* Section Title */}
          <div className='px-6 pt-2 pb-1 text-xs font-semibold text-gray-400 tracking-wider uppercase'>
            Main
          </div>
          {/* Navigation */}
          <nav className='mt-2 flex flex-col gap-1 px-2'>
            <SidebarLink
              href='/admin/dashboard'
              icon={<ChartPieIcon size={20} />}
              label='Dashboard'
              active={isActive("/admin/dashboard")}
              onClick={() => setIsOpen(false)}
            />
            <SidebarLink
              href='/admin/cohorts'
              icon={<SquareLibrary size={20} />}
              label='Cohorts'
              active={isActive("/admin/cohorts")}
              onClick={() => setIsOpen(false)}
            />
            <SidebarLink
              href='/admin/courses'
              icon={<BookOpen size={20} />}
              label='Courses'
              active={isActive("/admin/courses")}
              onClick={() => setIsOpen(false)}
            />
          </nav>
        </div>
        {/* Logout */}
        <div className='mb-6 px-4'>
          {/* Divider */}
          <div className=''>
            <hr className='my-4 border-gray-200' />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className='flex items-center gap-2 px-4 py-2 w-full text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition'
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
        <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </aside>
    </div>
  );
};

// SidebarLink component for DRYness and accessibility
function SidebarLink({
  href,
  icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
        ${
          active
            ? "bg-blue-50 text-blue-700 shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {icon}
      {label}
    </Link>
  );
}
