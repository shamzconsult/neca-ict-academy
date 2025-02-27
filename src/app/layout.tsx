import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/atom/Navbar";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/atom/Footer";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
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
    <html lang="en">
      <body className={` ${poppins.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
