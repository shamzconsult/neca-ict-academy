import Contact from '@/components/atom/Contact';

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <div className="bg-white overflow-hidden">
          <div className="p-6 sm:p-10">
            <Contact />
          </div>
        </div>
      </div>
    </main>
  );
}
