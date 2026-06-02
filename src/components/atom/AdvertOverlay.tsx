"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "../visually-hidden";
import Link from "next/link";

const AD_IMAGES = [
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1780417489/enrollment/course/xtjtebrod69yvlsbkbut.png",
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

export const AdvertOverlay: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open || activeIndices.length <= 1 || !shouldAutoScroll) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => getNextActiveIdx(prev));
        setIsTransitioning(false);
      }, 300);
    }, SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [open, shouldAutoScroll, activeIdx, activeIndices.length]);

  const handleClose = () => {
    setOpen(false);
  };

  const pauseAutoScroll = () => setIsHovered(true);
  const resumeAutoScroll = () => setIsHovered(false);

  if (!open) return null;

  const sharedWrapperProps = {
    className: "relative block w-full max-w-full",
    onMouseEnter: pauseAutoScroll,
    onMouseLeave: resumeAutoScroll,
    onTouchStart: pauseAutoScroll,
    onTouchEnd: resumeAutoScroll,
  };

  const advertImage = (
    <>
      <img
        src={AD_IMAGES[activeIdx].url}
        alt={`Advert ${activeIdx + 1}`}
        className={cn(
          "mx-auto w-full max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300",
          "max-h-[min(62dvh,520px)] sm:max-h-[80vh]",
          isTransitioning ? "opacity-0" : "opacity-100",
        )}
      />
      {!currentImage?.active && (
        <div className='absolute left-2 top-2 rounded-full bg-red-600/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-sm'>
          Past Event
        </div>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTitle asChild>
        <VisuallyHidden>NECA ICT Academy Advert</VisuallyHidden>
      </DialogTitle>
      <DialogContent
        className={cn(
          "flex max-h-[100dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col",
          "overflow-x-hidden overflow-y-auto border-none bg-transparent p-2 shadow-none",
          "sm:h-auto sm:max-h-[95vh] sm:w-full sm:max-w-[min(100vw,56rem)] sm:p-4",
        )}
        hideClose
      >
        <DialogClose asChild>
          <button
            type='button'
            className='absolute right-2 top-2 z-50 flex size-9 items-center justify-center rounded-full bg-black/30 text-2xl font-bold text-white transition hover:bg-black/40 hover:text-red-300 sm:right-4 sm:top-4 sm:size-11 sm:text-3xl'
            onClick={handleClose}
            aria-label='Close advert'
          >
            &times;
          </button>
        </DialogClose>

        <div className='flex w-full min-w-0 flex-col items-center justify-center gap-3 py-1 sm:gap-4 sm:py-2'>
          {currentImage?.active ? (
            <Link href='/enroll' {...sharedWrapperProps}>
              {advertImage}
            </Link>
          ) : (
            <div {...sharedWrapperProps}>{advertImage}</div>
          )}

          <div className='flex w-full min-w-0 max-w-full items-center gap-1.5 px-0.5 sm:gap-2 sm:px-0 justify-center'>
            <button
              type='button'
              onClick={() => scrollThumbnails("left")}
              disabled={!canScrollLeft}
              aria-label='Scroll thumbnails left'
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-md transition sm:size-8",
                canScrollLeft
                  ? "cursor-pointer hover:scale-110 hover:bg-white"
                  : "cursor-not-allowed opacity-30",
              )}
            >
              <ChevronLeft className='size-4 text-gray-700 sm:size-5' />
            </button>

            <div
              ref={scrollContainerRef}
              onScroll={updateScrollButtons}
              className={cn(
                "min-w-0 flex-1 overflow-x-auto px-1 py-1 no-scrollbar sm:px-2",
                "max-w-[calc(3*3rem+2*0.5rem+0.5rem)] sm:max-w-[calc(5*4rem+4*0.75rem+1rem)]",
              )}
            >
              <div className='flex w-max gap-2 sm:gap-3'>
                {AD_IMAGES.map((image, idx) => (
                  <button
                    type='button'
                    data-thumb
                    data-active={idx === activeIdx ? "true" : "false"}
                    key={`${image.url}-${idx}`}
                    onMouseEnter={pauseAutoScroll}
                    onMouseLeave={resumeAutoScroll}
                    onTouchStart={pauseAutoScroll}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Show advert ${idx + 1}${!image.active ? " (Past Event)" : ""}`}
                    aria-current={idx === activeIdx ? "true" : undefined}
                    className={cn(
                      "relative size-12 shrink-0 rounded border-2 bg-white p-0.5 shadow-md transition sm:size-16",
                      idx === activeIdx
                        ? "border-[#27156F] ring-2 ring-[#27156F]/30"
                        : "border-white opacity-80 hover:scale-105",
                    )}
                  >
                    <img
                      src={image.url}
                      alt={`Advert ${idx + 1} thumbnail`}
                      className={cn(
                        "size-full rounded object-cover",
                        !image.active && "grayscale",
                      )}
                    />
                    {!image.active && (
                      <div className='absolute inset-0 flex items-center justify-center rounded bg-black/30'>
                        <span className='text-[7px] font-medium text-white sm:text-[8px]'>
                          Past
                        </span>
                      </div>
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
                "flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-md transition sm:size-8",
                canScrollRight
                  ? "cursor-pointer hover:scale-110 hover:bg-white"
                  : "cursor-not-allowed opacity-30",
              )}
            >
              <ChevronRight className='size-4 text-gray-700 sm:size-5' />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
