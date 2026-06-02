import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function AdminSectionHeader({
  title,
  cta,
  className,
}: {
  title: string | ReactNode;
  cta?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-start md:justify-between",
        className,
      )}
    >
      <h1 className='text-xl font-bold leading-tight text-[#27156F] sm:text-2xl'>
        {title}
      </h1>
      {cta && (
        <div className='flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto'>
          {cta}
        </div>
      )}
    </header>
  );
}
