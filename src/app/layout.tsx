import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { NECA_ICT_ACADEMY_LOGO } from "@/const";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "NECA ICT Academy | Empowering Nigeria's Future with ICT Skills & Employability",
  description:
    "NECA ICT Academy is a leading initiative by the Nigeria Employers' Consultative Association (NECA) to empower young Nigerians with world-class ICT skills, certifications, and mentorship. Our programs include Python Programming, ICDL, Digital Marketing, Graphics Design, and Web Design. Join our talent network, access top graduates and technicians, and partner with us to reduce unemployment and foster entrepreneurship in Nigeria.",
  keywords: [
    "NECA ICT Academy",
    "Nigeria Employers' Consultative Association",
    "ICT Training Nigeria",
    "Python Programming",
    "Digital Marketing",
    "Graphics Design",
    "Web Design",
    "Employability",
    "Entrepreneurship",
    "Technical Skills",
    "Youth Empowerment",
    "Free ICT Training",
    "NECA Talent Network",
    "Unemployment Solutions Nigeria",
    "Tech Skills Nigeria",
    "Contact NECA",
    "Training",
  ],
  openGraph: {
    title:
      "NECA ICT Academy | Empowering Nigeria's Future with ICT Skills & Employability",
    description:
      "Join NECA ICT Academy to gain globally recognized ICT skills, certifications, and mentorship. Connect with top employers, access our job seekers' database, and be part of Nigeria's leading employability initiative.",
    url: "https://www.necaictacademy.org",
    type: "website",
    images: [
      {
        url: NECA_ICT_ACADEMY_LOGO,
        width: 800,
        height: 600,
        alt: "NECA ICT Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NECA ICT Academy | Empowering Nigeria's Future with ICT Skills & Employability",
    description:
      "NECA ICT Academy offers free ICT training, certifications, and job opportunities for young Nigerians. Join our talent network and connect with top employers.",
    images: [
      "https://res.cloudinary.com/dtryuudiy/image/upload/v1747140810/899aad12-5c86-4d93-815a-30d3f7f39993_cgix5e.webp",
    ],
  },
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
