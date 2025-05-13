import { Separator } from "@/components/ui/separator";
import { PanelLeft } from "lucide-react";
import { ReactNode } from "react";
import { useSidebar } from "@/app/admin/layout";

export function AdminSectionHeader({
  title,
  cta,
}: {
  title: string | ReactNode;
  cta?: ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  return (
    <header className='flex gap-2 items-center justify-between mb-8'>
      <div className='flex gap-2 items-center'>
        <div className='hidden lg:flex justify-start'>
          <button
            onClick={toggleSidebar}
            className='p-2 rounded hover:bg-gray-100 transition'
            aria-label='Toggle sidebar'
          >
            <PanelLeft size={20} />
          </button>
        </div>
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <h1 className='text-2xl font-bold text-gray-800'>{title}</h1>
      </div>
      {cta && <div className='flex gap-3'>{cta}</div>}
    </header>
  );
}
