"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HorizontalScrollArea } from "@/components/ui/scroll-area";

const GALLERY_IMAGES = [
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1771171011/enrollment/gallery/u9nknwmyq7cyknxufyjd.jpg",
    alt: "NECA ICT Academy cohort members at an indoor ceremony",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1763368466/enrollment/gallery/hdg9unjlg6zsh6vtqemg.jpg",
    alt: "NECA ICT Academy graduates at a graduation ceremony with HP laptop awards",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1763368038/enrollment/gallery/jig7xubolbk2qd8lrdiz.jpg",
    alt: "NECA ICT Academy graduates at a graduation ceremony with HP laptop awards",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1763368041/enrollment/gallery/ifj85zuq0otyhalxviya.jpg",
    alt: "NECA ICT Academy graduates at a graduation ceremony with HP laptop awards",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1763368210/enrollment/gallery/i85ejz6rb5i0kmofqw0p.jpg",
    alt: "NECA ICT Academy cohort members at an indoor ceremony",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1775549434/enrollment/gallery/jxvcoaylj707xlowkii1.jpg",
    alt: "NECA ICT Academy graduates holding certificates of completion",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1771171012/enrollment/gallery/eehi1n6vjwnwfsxyblkw.jpg",
    alt: "NECA ICT Academy project presentation and ceremony",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1770885062/enrollment/gallery/invyqroyhmu0tppkluna.jpg",
    alt: "NECA ICT Academy graduates at a graduation ceremony with HP laptop awards",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1758804541/enrollment/gallery/oolucwdonwgjqalp8nly.jpg",
    alt: "NECA ICT Academy project presentation and ceremony",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1758805345/enrollment/gallery/rdyp3lngxffynswiyntm.jpg",
    alt: "NECA ICT Academy project presentation and ceremony",
  },
  {
    src: "https://res.cloudinary.com/dtryuudiy/image/upload/v1758804540/enrollment/gallery/l7mlld1kaxopafi6suif.jpg",
    alt: "NECA ICT Academy project presentation and ceremony",
  },
] as const;

type CohortGalleryProps = {
  variant?: "sidebar" | "compact";
};

function GalleryThumbnails({
  activeIndex,
  onSelect,
  compact = false,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(compact ? "px-4 pb-4 pt-1" : "mt-3")}>
      <HorizontalScrollArea>
        <div className='flex w-max gap-2 pb-2'>
          {GALLERY_IMAGES.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type='button'
              aria-label={`View photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => onSelect(index)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg transition-all",
                compact ? "size-14" : "h-14 w-[4.5rem] sm:w-16",
                index === activeIndex
                  ? "ring-2 ring-[#27156F] ring-offset-1"
                  : "opacity-60 hover:opacity-90",
              )}
            >
              <Image
                src={image.src}
                alt=''
                fill
                className='object-cover'
                sizes='64px'
              />
            </button>
          ))}
        </div>
      </HorizontalScrollArea>
    </div>
  );
}

function GalleryHero({
  activeIndex,
  onPrevious,
  onNext,
  className,
  imageSizes,
}: {
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
  imageSizes: string;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-xl bg-[#27156F]/5 shadow-sm ring-1 ring-[#27156F]/10",
        className,
      )}
    >
      {GALLERY_IMAGES.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-in-out",
            index === activeIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className='object-cover'
            sizes={imageSizes}
            priority={index === 0}
          />
        </div>
      ))}

      <div className='pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-10'>
        <p className='text-xs font-medium text-white/90'>
          {activeIndex + 1} of {GALLERY_IMAGES.length}
        </p>
      </div>

      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Previous photo'
        onClick={onPrevious}
        className='absolute left-2 top-1/2 size-8 -translate-y-1/2 border-white/30 bg-white/90 text-[#27156F] opacity-100 shadow-sm backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white'
      >
        <ChevronLeft className='size-4' />
      </Button>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label='Next photo'
        onClick={onNext}
        className='absolute right-2 top-1/2 size-8 -translate-y-1/2 border-white/30 bg-white/90 text-[#27156F] opacity-100 shadow-sm backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white'
      >
        <ChevronRight className='size-4' />
      </Button>
    </div>
  );
}

export function CohortGallery({ variant = "sidebar" }: CohortGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(
      ((index % GALLERY_IMAGES.length) + GALLERY_IMAGES.length) %
        GALLERY_IMAGES.length,
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  if (variant === "compact") {
    return (
      <div className='w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20'>
        <div className='border-b border-[#27156F]/10 px-4 py-3 text-left'>
          <h3 className='text-sm font-bold text-[#27156F]'>
            Previous cohort highlights
          </h3>
          <p className='mt-0.5 text-xs text-gray-600'>
            Graduations, training, and celebrations
          </p>
        </div>

        <div
          className='p-4'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
        >
          <GalleryHero
            activeIndex={activeIndex}
            onPrevious={() => goTo(activeIndex - 1)}
            onNext={() => goTo(activeIndex + 1)}
            imageSizes='(max-width: 640px) 100vw, 640px'
          />
        </div>

        <GalleryThumbnails
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          compact
        />
      </div>
    );
  }

  return (
    <div
      className='w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className='border-b border-[#27156F]/10 px-4 py-4 text-left sm:px-5'>
        <h2 className='text-base font-bold text-[#27156F] sm:text-lg'>
          Previous cohort highlights
        </h2>
        <p className='mt-1 text-sm text-gray-600'>
          Real moments from graduations, training sessions, and celebrations
          across past intakes.
        </p>
      </div>

      <div className='min-w-0 p-4 pt-3 sm:p-5 sm:pt-4'>
        <GalleryHero
          activeIndex={activeIndex}
          onPrevious={() => goTo(activeIndex - 1)}
          onNext={() => goTo(activeIndex + 1)}
          imageSizes='(max-width: 1024px) 100vw, 40vw'
        />

        <GalleryThumbnails
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </div>
  );
}
