"use client";

import { PageLoader } from "@/components/atom/PageLoader";
import { Sidebar } from "@/components/atom/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SidebarContext } from "@/contexts/SidebarContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const PUBLIC_ADMIN_ROUTES = ["/admin/forgot-password", "/admin/reset-password"];

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  useEffect(() => {
    if (!isDesktop && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isDesktop, sidebarCollapsed]);

  useEffect(() => {
    if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      setAuthenticated(true);
      return;
    }

    if (status === "loading") {
      setAuthenticated(null);
      return;
    }

    if (status === "unauthenticated") {
      setAuthenticated(false);
      router.push("/signin");
    } else if (status === "authenticated") {
      if (
        session?.user?.role === "Admin" ||
        session?.user?.role === "Super_Admin"
      ) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/unauthorized");
      }
    }
  }, [router, pathname, status, session]);

  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return <PageLoader className='bg-gray-50' />;
  }

  if (authenticated === false) {
    return null;
  }

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row lg:gap-5">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div
          className={`min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
          }`}
        >
          <main className="lg:pt-6">
            <div className="min-h-screen bg-white p-4 shadow-sm sm:p-6 lg:rounded-tl-xl lg:shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
}
