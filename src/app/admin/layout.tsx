"use client";

import { Sidebar } from "@/components/atom/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import AdminSessionProvider from "./AdminSessionProvider";
import { PanelLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PUBLIC_ADMIN_ROUTES = ["/admin/forgot-password", "/admin/reset-password"];

// Sidebar context for toggling from any child
interface SidebarContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarContext");
  return ctx;
};

// Custom hook to detect mobile/small screens
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();
  const [showMobileDialog, setShowMobileDialog] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

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
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E02B20]'></div>
      </div>
    );
  }

  if (authenticated === false) {
    return null;
  }

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <div className='flex flex-col lg:flex-row bg-gray-50 min-h-screen gap-5'>
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div
          className={`w-full flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[64px]" : "lg:ml-[260px]"}`}
        >
          <main className='pt-6 pr-0'>
            <div className='shadow-lg rounded-tl-xl bg-white min-h-screen p-6'>
              {children}
            </div>
          </main>
        </div>
        {/* Mobile warning dialog */}
        <Dialog
          open={isMobile && showMobileDialog}
          onOpenChange={setShowMobileDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Desktop Recommended</DialogTitle>
            </DialogHeader>
            <p>
              The admin dashboard is optimized for desktop devices. For the best
              experience, please use a laptop or desktop computer.
            </p>
            <DialogFooter>
              <button
                className='bg-[#E02B20] text-white px-4 py-2 rounded'
                onClick={() => setShowMobileDialog(false)}
              >
                Continue Anyway
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarContext.Provider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </AdminSessionProvider>
  );
}
