"use client";

import { Sidebar } from "@/components/atom/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminSessionProvider from "./AdminSessionProvider";

const PUBLIC_ADMIN_ROUTES = ["/admin/forgot-password", "/admin/reset-password"];

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      setAuthenticated(true);
      return;
    }

    if (status === "unauthenticated") {
      router.push("/" + encodeURIComponent(pathname));
    } else if (status === "authenticated") {
      if (
        session?.user?.role === "Admin" ||
        session?.user?.role === "Super_Admin"
      ) {
        setAuthenticated(true);
      } else {
        router.push("/unauthorized");
      }
    }
  }, [router, pathname, status, session]);

  // if (authenticated === null) {
  //   return (
  //     <div className='flex items-center justify-center h-screen'>
  //       <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E02B20]'></div>
  //     </div>
  //   );
  // }

  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className='flex flex-col lg:flex-row bg-gray-50 min-h-screen'>
      <Sidebar />
      <div className='w-full flex-1 overflow-y-auto lg:ml-[280px]'>
        {/* <div className='hidden md:flex justify-end items-center w-full p-4 bg-white shadow-sm'>
          <AdminLogo />
        </div> */}
        <main className='p-6 pl-0'>{children}</main>
      </div>
    </div>
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
