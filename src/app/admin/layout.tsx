"use client";

import { AdminLogo } from "@/components/atom/AdminLogo";
import { Sidebar } from "@/components/atom/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isSignedIn") === "true";
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  if (authenticated === null) {
    return null;
  }
  return (
    <div className="flex flex-col lg:flex-row bg-[#FAFAFA] px-4  h-screen overflow-y-auto  ">
      <Sidebar />
      <div className="w-full  flex-1 h-screen overflow-y-auto">
        <div className="hidden md:flex justify-end items-end w-full mt-1 mb-5">
          <AdminLogo />
        </div>
        <main className="mt-3">{children}</main>
      </div>
    </div>
  );
}
