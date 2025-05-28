"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/components/ReactQueryProvider";

interface Props {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: Props) {
  return (
    <SessionProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>
  );
}
