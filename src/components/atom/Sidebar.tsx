"use client";

import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  ExternalLink,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  SquareLibrary,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AdminLogo } from "./AdminLogo";
import { LogoutModal } from "./LogoutModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  match: (pathname: string) => boolean;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (pathname) => pathname === "/admin/dashboard",
  },
  {
    href: "/admin/cohorts",
    label: "Cohorts",
    icon: SquareLibrary,
    match: (pathname) => pathname.startsWith("/admin/cohorts"),
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
    match: (pathname) => pathname.startsWith("/admin/courses"),
  },
  {
    href: "/admin/graduates",
    label: "Graduates",
    icon: GraduationCap,
    match: (pathname) =>
      pathname.startsWith("/admin/graduates") &&
      !pathname.startsWith("/admin/graduation-titles"),
  },
  {
    href: "/admin/graduation-titles",
    label: "Graduation Titles",
    icon: Award,
    match: (pathname) => pathname.startsWith("/admin/graduation-titles"),
  },
  {
    href: "/gallery",
    label: "Manage Gallery",
    icon: ImageIcon,
    match: () => false,
    external: true,
  },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "AD";
}

export const Sidebar = ({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const effectiveCollapsed = collapsed && isDesktop;

  const userName = session?.user?.firstName
    ? `${session?.user?.firstName} ${session?.user?.lastName}`
    : "";
  const userEmail = session?.user?.email ?? "";
  const userRole = session?.user?.role?.replace("_", " ") ?? "Admin";
  const initials = getInitials(userName, userEmail);

  const closeMobile = () => setIsOpen(false);

  return (
    <div className='relative'>
      {/* Mobile top bar */}
      <div className='flex items-center justify-between border-b border-[#27156F]/10 bg-white px-4 py-3 shadow-sm lg:hidden'>
        <button
          type='button'
          className='rounded-lg p-2 text-[#27156F] transition hover:bg-[#DBEAF6]/60'
          onClick={() => setIsOpen(true)}
          aria-label='Open menu'
        >
          <Menu className='size-5' />
        </button>
        <AdminLogo compact />
        <div className='size-9' aria-hidden />
      </div>

      {isOpen && (
        <button
          type='button'
          className='fixed inset-0 z-40 bg-[#27156F]/40 backdrop-blur-[1px] lg:hidden'
          onClick={closeMobile}
          aria-label='Close menu'
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-[#27156F]/10 bg-white shadow-sm transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          effectiveCollapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-[#27156F]/10",
            effectiveCollapsed
              ? "justify-center px-2 py-4"
              : "justify-between px-4 py-4",
          )}
        >
          {effectiveCollapsed ? (
            <Link
              href='/admin/dashboard'
              className='flex size-10 items-center justify-center rounded-xl bg-[#27156F] text-sm font-bold text-white'
              onClick={closeMobile}
            >
              N
            </Link>
          ) : (
            <Link
              href='/admin/dashboard'
              onClick={closeMobile}
              className='-ml-1'
            >
              <AdminLogo compact />
            </Link>
          )}

          {!effectiveCollapsed && (
            <button
              type='button'
              className='hidden rounded-lg p-2 text-[#27156F]/70 transition hover:bg-[#DBEAF6]/60 hover:text-[#27156F] lg:flex'
              onClick={onToggle}
              aria-label='Collapse sidebar'
            >
              <PanelLeftClose className='size-5' />
            </button>
          )}

          <button
            type='button'
            className='rounded-lg p-2 text-[#27156F]/70 transition hover:bg-[#DBEAF6]/60 lg:hidden'
            onClick={closeMobile}
            aria-label='Close menu'
          >
            <X className='size-5' />
          </button>
        </div>

        {effectiveCollapsed && (
          <div className='hidden border-b border-[#27156F]/10 px-2 py-2 lg:flex lg:justify-center'>
            <button
              type='button'
              className='rounded-lg p-2 text-[#27156F]/70 transition hover:bg-[#DBEAF6]/60 hover:text-[#27156F]'
              onClick={onToggle}
              aria-label='Expand sidebar'
            >
              <PanelLeftOpen className='size-5' />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto px-3 py-4",
            effectiveCollapsed && "px-2",
          )}
        >
          {!effectiveCollapsed && (
            <p className='mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400'>
              Main menu
            </p>
          )}
          <ul className='flex flex-col gap-1'>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <SidebarLink
                  item={item}
                  active={item.match(pathname)}
                  collapsed={effectiveCollapsed}
                  onClick={closeMobile}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "shrink-0 border-t border-[#27156F]/10 p-3",
            effectiveCollapsed && "px-2",
          )}
        >
          {!effectiveCollapsed && (
            <p className='mb-2 px-1 text-[10px] uppercase tracking-wide text-gray-400'>
              {userRole}
            </p>
          )}
          {!effectiveCollapsed && (
            <div className='mb-3 flex items-center gap-3 rounded-xl bg-[#DBEAF6]/40 px-3 py-2.5'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[#27156F] text-xs font-bold text-white'>
                {initials}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-[#27156F]'>
                  {userName}
                </p>
                <p className='truncate text-xs text-gray-500'>{userEmail}</p>
              </div>
            </div>
          )}

          {effectiveCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={() => setShowModal(true)}
                  className='flex w-full items-center justify-center rounded-lg p-2.5 text-[#E02B20] transition hover:bg-red-50'
                  aria-label='Logout'
                >
                  <LogOut className='size-5' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>Logout</TooltipContent>
            </Tooltip>
          ) : (
            <button
              type='button'
              onClick={() => setShowModal(true)}
              className='flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#E02B20] transition hover:bg-red-50'
            >
              <LogOut className='size-4 shrink-0' />
              Sign out
            </button>
          )}
        </div>

        <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </aside>
    </div>
  );
};

function SidebarLink({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
        active
          ? "bg-[#27156F] text-white shadow-sm"
          : "text-gray-600 hover:bg-[#DBEAF6]/50 hover:text-[#27156F]",
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          active
            ? "text-white"
            : "text-[#27156F]/70 group-hover:text-[#27156F]",
        )}
      />
      {!collapsed && (
        <>
          <span className='flex-1 truncate'>{item.label}</span>
          {item.external && (
            <ExternalLink className='size-3.5 shrink-0 opacity-60' />
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side='right'>{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
