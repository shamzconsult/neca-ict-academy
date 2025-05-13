import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NECA Academy",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
