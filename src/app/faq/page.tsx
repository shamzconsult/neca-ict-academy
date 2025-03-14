import Faq from '@/components/atom/Faq';

export default function FaqPage() {
    return (
        <main className="min-h-screen flex flex-col items-center pt-20 justify-center py-10 px-4 sm:px-4 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white overflow-hidden">
            <div className="p-6 sm:p-5">
              <Faq />
            </div>
          </div>
        </div>
      </main >
    )
}