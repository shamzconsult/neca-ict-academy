import { NECA_ICT_ACADEMY_LOGO } from "@/const";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
  label?: string;
};

export function PageLoader({ className, label }: PageLoaderProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-busy='true'
      aria-label={label ?? "Loading page"}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white",
        className,
      )}
    >
      <div className='relative flex size-40 shrink-0 items-center justify-center overflow-hidden sm:size-44'>
        <div className='absolute size-[84%] rounded-full border-2 border-transparent border-t-[#27156F] border-r-[#E02B20]/80 animate-loader-ring' />
        <div className='absolute size-[68%] rounded-full border-2 border-transparent border-b-[#27156F]/40 border-l-[#E02B20] animate-loader-ring-reverse' />

        <div className='relative z-10 flex h-12 w-[62%] items-center justify-center overflow-hidden sm:h-14 sm:w-[58%]'>
          <img
            src={NECA_ICT_ACADEMY_LOGO}
            alt='NECA ICT Academy'
            className='max-h-full max-w-full object-contain animate-logo-breathe'
          />
          <div className='pointer-events-none absolute inset-0 animate-loader-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent' />
        </div>
      </div>

      {label ? (
        <p className='mt-5 text-sm font-medium text-[#27156F]/80'>{label}</p>
      ) : null}

      <div className='mt-3 flex items-center gap-1.5' aria-hidden='true'>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className='size-1.5 rounded-full bg-[#E02B20] animate-loader-dot'
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
