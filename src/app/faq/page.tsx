import Faq from "@/components/atom/Faq";
import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen flex flex-col items-center pt-20 justify-center py-10 px-4 sm:px-4 lg:px-8'>
        <div className='w-full max-w-7xl'>
          <div className='bg-white overflow-hidden'>
            <Faq />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
