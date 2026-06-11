"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  Megaphone,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "../visually-hidden";
import Link from "next/link";

const AD_IMAGES = [
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1781168124/ITF_NECA_flyer_deadline_13_June_2026_no_necaofficial_1_clrfw6.png",
    active: true,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1769585637/NECA_Academy_-_Free_AI_course_f1jo57.jpg",
    active: false,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1747153124/ICT_ACADEMY_FLIER_2_1_2_1_yswykd.jpg",
    active: false,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1747147393/enrollment/course/mxgu4h5xa295wk4igdr4.webp",
    active: false,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1748613785/neca_flier_2_2_pgmlai.webp",
    active: false,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1747134855/enrollment/course/nod3uf4l2bhrr4fzp9wc.webp",
    active: false,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1749112300/NECA_ICT_ACADEMY_8_Weeks_AI_Course_FLIER_mqyk7n.jpg",
    active: false,
  },
];

const SWITCH_INTERVAL = 5000;
const SHOW_DELAY_MS = 2000;

export const AdvertOverlay: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);

    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollThumbnails = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstThumb = container.querySelector<HTMLElement>("[data-thumb]");
    const gap = window.innerWidth < 640 ? 8 : 12;
    const scrollAmount = firstThumb ? firstThumb.offsetWidth + gap : 76;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollActiveThumbIntoView = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeThumb = container.querySelector<HTMLElement>(
      `[data-thumb][data-active="true"]`,
    );
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const update = () => requestAnimationFrame(updateScrollButtons);

    update();
    const timer = setTimeout(update, 100);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);

    window.addEventListener("resize", update);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [open, activeIdx, updateScrollButtons]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(scrollActiveThumbIntoView, 50);
    return () => clearTimeout(timer);
  }, [open, activeIdx, scrollActiveThumbIntoView]);

  const currentImage = AD_IMAGES[activeIdx];
  const shouldAutoScroll = currentImage?.active && !isHovered;

  const activeIndices = AD_IMAGES.map((img, idx) =>
    img.active ? idx : -1,
  ).filter((idx) => idx !== -1);

  const getNextActiveIdx = (currentIdx: number) => {
    if (activeIndices.length <= 1) return currentIdx;
    const currentPos = activeIndices.indexOf(currentIdx);
    const nextPos = (currentPos + 1) % activeIndices.length;
    return activeIndices[nextPos];
  };

  const getPrevIdx = (currentIdx: number) =>
    (currentIdx - 1 + AD_IMAGES.length) % AD_IMAGES.length;

  const getNextIdx = (currentIdx: number) =>
    (currentIdx + 1) % AD_IMAGES.length;

  const goToSlide = (idx: number) => {
    if (idx === activeIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    if (!open || activeIndices.length <= 1 || !shouldAutoScroll) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => getNextActiveIdx(prev));
        setIsTransitioning(false);
      }, 200);
    }, SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [open, shouldAutoScroll, activeIdx, activeIndices.length]);

  const handleClose = () => setOpen(false);
  const pauseAutoScroll = () => setIsHovered(true);
  const resumeAutoScroll = () => setIsHovered(false);

  if (!open) return null;

  const imageWrapperProps = {
    className: "group/image relative block w-full",
    onMouseEnter: pauseAutoScroll,
    onMouseLeave: resumeAutoScroll,
    onTouchStart: pauseAutoScroll,
    onTouchEnd: resumeAutoScroll,
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTitle asChild>
        <VisuallyHidden>NECA ICT Academy Announcements</VisuallyHidden>
      </DialogTitle>
      <DialogContent
        className={cn(
          "max-h-[100dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden",
          "border-none bg-transparent p-0 shadow-none",
          "sm:max-h-[95vh] sm:w-full sm:max-w-2xl",
        )}
        hideClose
      >
        <div className='overflow-hidden rounded-2xl bg-white shadow-2xl'>
          {/* Header */}
          <div className='flex items-center justify-between gap-3 border-b border-[#27156F]/10 bg-gradient-to-r from-[#27156F] to-[#27156F]/90 px-4 py-3 sm:px-5'>
            <div className='flex min-w-0 items-center gap-2.5 text-white'>
              <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15'>
                <Megaphone className='size-4' aria-hidden />
              </span>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold sm:text-base'>
                  Announcements
                </p>
                <p className='text-[11px] text-white/75 sm:text-xs'>
                  {activeIdx + 1} of {AD_IMAGES.length}
                </p>
              </div>
            </div>
            <DialogClose asChild>
              <button
                type='button'
                onClick={handleClose}
                aria-label='Close announcements'
                className='flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25'
              >
                <X className='size-4' />
              </button>
            </DialogClose>
          </div>

          {/* Main slide */}
          <div className='relative bg-gradient-to-b from-[#DBEAF6]/40 to-white px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5'>
            <div className='relative'>
              {currentImage?.active ? (
                <Link href='/enroll' {...imageWrapperProps}>
                  <SlideImage
                    src={AD_IMAGES[activeIdx].url}
                    index={activeIdx}
                    isTransitioning={isTransitioning}
                    isActive={true}
                  />
                </Link>
              ) : (
                <div {...imageWrapperProps}>
                  <SlideImage
                    src={AD_IMAGES[activeIdx].url}
                    index={activeIdx}
                    isTransitioning={isTransitioning}
                    isActive={false}
                  />
                </div>
              )}

              <button
                type='button'
                onClick={() => goToSlide(getPrevIdx(activeIdx))}
                aria-label='Previous announcement'
                className='absolute left-1 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/55 sm:left-2 sm:opacity-0 sm:group-hover/image:opacity-100'
              >
                <ChevronLeft className='size-5' />
              </button>
              <button
                type='button'
                onClick={() => goToSlide(getNextIdx(activeIdx))}
                aria-label='Next announcement'
                className='absolute right-1 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/55 sm:right-2 sm:opacity-0 sm:group-hover/image:opacity-100'
              >
                <ChevronRight className='size-5' />
              </button>
            </div>

            <div className='mt-4 flex justify-center'>
              {currentImage?.active ? (
                <Button
                  asChild
                  className='h-10 gap-2 rounded-full bg-[#E02B20] px-6 font-semibold text-white shadow-md hover:bg-[#c9251c]'
                >
                  <Link href='/enroll'>
                    Apply Now
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className='h-10 gap-2 rounded-full bg-gray-400 px-6 font-semibold text-white shadow-md disabled:pointer-events-none disabled:opacity-100'
                >
                  Event Ended
                  <Lock className='size-4' />
                </Button>
              )}
            </div>
          </div>

          {/* Dot indicators */}
          <div className='flex justify-center gap-1.5 border-t border-[#27156F]/5 bg-[#FBFBFB] px-4 py-2.5'>
            {AD_IMAGES.map((image, idx) => (
              <button
                key={`dot-${image.url}-${idx}`}
                type='button'
                onClick={() => goToSlide(idx)}
                aria-label={`Go to announcement ${idx + 1}`}
                aria-current={idx === activeIdx ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === activeIdx
                    ? "w-6 bg-[#27156F]"
                    : "w-1.5 bg-[#27156F]/25 hover:bg-[#27156F]/45",
                )}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className='flex justify-center items-center gap-1.5 border-t border-[#27156F]/10 bg-[#F5F7FA] px-2 py-3 sm:gap-2 sm:px-4'>
            <button
              type='button'
              onClick={() => scrollThumbnails("left")}
              disabled={!canScrollLeft}
              aria-label='Scroll thumbnails left'
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border border-[#27156F]/10 bg-white shadow-sm transition",
                canScrollLeft
                  ? "text-[#27156F] hover:border-[#27156F]/25 hover:bg-[#DBEAF6]/50"
                  : "cursor-not-allowed opacity-30",
              )}
            >
              <ChevronLeft className='size-4' />
            </button>

            <div
              ref={scrollContainerRef}
              onScroll={updateScrollButtons}
              className={cn(
                "min-w-0 flex-1 overflow-x-auto no-scrollbar",
                "max-w-[calc(3*3rem+2*0.5rem)] sm:max-w-[calc(5*4rem+4*0.75rem)]",
              )}
            >
              <div className='flex w-max gap-2'>
                {AD_IMAGES.map((image, idx) => (
                  <button
                    type='button'
                    data-thumb
                    data-active={idx === activeIdx ? "true" : "false"}
                    key={`thumb-${image.url}-${idx}`}
                    onMouseEnter={pauseAutoScroll}
                    onMouseLeave={resumeAutoScroll}
                    onTouchStart={pauseAutoScroll}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Show announcement ${idx + 1}${!image.active ? " (Past event)" : ""}`}
                    aria-current={idx === activeIdx ? "true" : undefined}
                    className={cn(
                      "relative size-12 shrink-0 overflow-hidden rounded-lg border-2 bg-white shadow-sm transition sm:size-14",
                      idx === activeIdx
                        ? "border-[#27156F] ring-2 ring-[#27156F]/20"
                        : "border-transparent opacity-70 hover:opacity-100",
                      !image.active && "opacity-60",
                    )}
                  >
                    <img
                      src={image.url}
                      alt=''
                      className={cn(
                        "size-full object-cover",
                        !image.active && "grayscale",
                      )}
                    />
                    {!image.active && (
                      <span className='absolute inset-x-0 bottom-0 bg-[#27156F]/80 py-0.5 text-center text-[7px] font-medium text-white sm:text-[8px]'>
                        Past
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type='button'
              onClick={() => scrollThumbnails("right")}
              disabled={!canScrollRight}
              aria-label='Scroll thumbnails right'
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border border-[#27156F]/10 bg-white shadow-sm transition",
                canScrollRight
                  ? "text-[#27156F] hover:border-[#27156F]/25 hover:bg-[#DBEAF6]/50"
                  : "cursor-not-allowed opacity-30",
              )}
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function SlideImage({
  src,
  index,
  isTransitioning,
  isActive,
}: {
  src: string;
  index: number;
  isTransitioning: boolean;
  isActive: boolean;
}) {
  return (
    <div className='relative overflow-hidden rounded-xl border border-[#27156F]/10 bg-white shadow-inner'>
      <img
        src={src}
        alt={`Announcement ${index + 1}`}
        className={cn(
          "mx-auto w-full object-contain transition-all duration-300",
          "max-h-[min(55dvh,480px)] sm:max-h-[min(65vh,520px)]",
          isTransitioning ? "scale-[0.98] opacity-0" : "scale-100 opacity-100",
        )}
      />
      {isActive ? (
        <span className='absolute left-3 top-3 rounded-full bg-[#27156F] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm sm:text-xs'>
          Open
        </span>
      ) : (
        <span className='absolute left-3 top-3 rounded-full bg-gray-800/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:text-xs'>
          Past event
        </span>
      )}
    </div>
  );
}
