"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { AdminLogo } from "./AdminLogo";
import { LogoutModal } from "./LogoutModal";
import { BookOpen, ChartPieIcon, SquareLibrary } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = ({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) => {
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
        className={`fixed top-0 left-0 h-screen bg-gray-50 flex flex-col justify-between transition-all duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${collapsed ? "w-[64px] pl-3" : "w-[260px]"}
        `}
      >
        <div>
          {/* Collapse/Expand button for desktop */}
          {/* <div className='hidden lg:flex justify-end p-2'>
            <button
              onClick={onToggle}
              className='p-2 rounded hover:bg-gray-100 transition'
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeft size={20} /> : <PanelLeft size={20} />}
            </button>
          </div> */}
          {/* Close button for mobile */}
          <button
            className='lg:hidden p-4 flex justify-end w-full'
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
          {/* Logo */}
          {!collapsed && <AdminLogo />}
          {collapsed && (
            <div className='flex flex-col items-start text-xl pt-3 font-extrabold text-[#27156F] my-4 text-center tracking-wide'>
              NECA
              {/* <span className='text-xs text-gray-500 align-sub ml-1'>ICT</span> */}
            </div>
          )}
          {/* Section Title */}
          {!collapsed && (
            <div className='px-6 pt-2 pb-1 text-xs font-semibold text-gray-400 tracking-wider uppercase'>
              Main
            </div>
          )}
          {/* Navigation */}
          <nav
            className={`mt-2 flex flex-col gap-1 px-2 ${collapsed ? "items-center" : ""}`}
          >
            <SidebarLink
              href='/admin/dashboard'
              icon={<ChartPieIcon size={20} />}
              label='Dashboard'
              active={isActive("/admin/dashboard")}
              onClick={() => setIsOpen(false)}
              collapsed={collapsed}
            />
            <SidebarLink
              href='/admin/cohorts'
              icon={<SquareLibrary size={20} />}
              label='Cohorts'
              active={isActive("/admin/cohorts")}
              onClick={() => setIsOpen(false)}
              collapsed={collapsed}
            />
            <SidebarLink
              href='/admin/courses'
              icon={<BookOpen size={20} />}
              label='Courses'
              active={isActive("/admin/courses")}
              onClick={() => setIsOpen(false)}
              collapsed={collapsed}
            />
          </nav>
        </div>
        {/* Logout */}
        <div
          className={cn(
            "mb-6 px-4 flex flex-col justify-center",
            collapsed && "px-0"
          )}
        >
          <div className=''>
            <hr className='my-4 border-gray-200' />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition
              ${collapsed ? "justify-center px-2 py-2" : "gap-2 px-4 py-2 w-full"}
            `}
          >
            <FiLogOut size={20} />
            {!collapsed && "Logout"}
          </button>
        </div>
        <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </aside>
    </div>
  );
};

function SidebarLink({
  href,
  icon,
  label,
  active,
  onClick,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  collapsed?: boolean;
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
        ${collapsed ? "justify-center px-2" : ""}
      `}
    >
      {icon}
      {!collapsed && label}
    </Link>
  );
}
