"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "../visually-hidden";

const AD_IMAGES = [
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1769585637/NECA_Academy_-_Free_AI_course_f1jo57.jpg",
    active: true,
  },
  {
    url: "https://res.cloudinary.com/dtryuudiy/image/upload/v1747153124/ICT_ACADEMY_FLIER_2_1_2_1_yswykd.jpg",
    active: true,
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

// const STORAGE_KEY = "neca_advert_overlay_dismissed";
// const EXPIRATION_KEY = "neca_advert_overlay_expiration";
const SWITCH_INTERVAL = 5000; // 5 seconds between switches
// const EXPIRATION_HOURS = 24; // Advert will expire after 24 hours

export const AdvertOverlay: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position to show/hide arrows
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  // Scroll by one card width
  const scrollThumbnails = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 76; // 64px card + 12px gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtons();
  }, [open]);

  // useEffect(() => {
  // if (typeof window === "undefined") return;

  // // Check if advert has expired
  // const expirationTime = localStorage.getItem(EXPIRATION_KEY);
  // const now = new Date().getTime();

  // if (expirationTime) {
  //   // If we have an expiration time, check if we're past it
  //   if (now > parseInt(expirationTime)) {
  //     return;
  //   }
  // } else {
  //   // If no expiration time is set, set it to 24 hours from now
  //   const newExpirationTime = now + EXPIRATION_HOURS * 60 * 60 * 1000;
  //   localStorage.setItem(EXPIRATION_KEY, newExpirationTime.toString());
  // }

  // // Only show if not dismissed before
  // const dismissed = localStorage.getItem(STORAGE_KEY);
  // if (!dismissed) setOpen(true);

  // }, []);

  // Only auto-scroll if the current image has active: true
  const currentImage = AD_IMAGES[activeIdx];
  const shouldAutoScroll = currentImage?.active && !isHovered;

  // Get indices of all active images for cycling
  const activeIndices = AD_IMAGES.map((img, idx) => (img.active ? idx : -1)).filter(
    (idx) => idx !== -1
  );

  // Find the next active image index
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
      }, 300); // Half of the transition duration
    }, SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [open, shouldAutoScroll, activeIdx]);

  const handleClose = () => {
    setOpen(false);
    // if (typeof window !== "undefined") {
    //   localStorage.setItem(STORAGE_KEY, "1");
    // }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTitle asChild>
        <VisuallyHidden>NECA ICT Academy Advert</VisuallyHidden>
      </DialogTitle>
      <DialogContent
        className='w-full sm:max-w-full h-full bg-transparent border-none shadow-none'
        hideClose
      >
        <DialogClose asChild>
          <button
            className='absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400 transition z-50'
            onClick={handleClose}
            aria-label='Close advert'
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &times;
          </button>
        </DialogClose>
        <div className='flex flex-col items-center justify-center'>
          <div
            className='relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={AD_IMAGES[activeIdx].url}
              alt={`Advert ${activeIdx + 1}`}
              className={`rounded-lg shadow-2xl sm:h-[80vh] sm:max-h-[80vh] object-contain transition-opacity duration-600 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            />
            {/* Past Event overlay for inactive images */}
            {!currentImage?.active && (
              <div className='absolute top-4 left-4 bg-red-600/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm'>
                Past Event
              </div>
            )}
          </div>
          <div className='mt-4 flex items-center gap-2'>
            {/* Left Arrow */}
            <button
              onClick={() => scrollThumbnails("left")}
              disabled={!canScrollLeft}
              aria-label='Scroll thumbnails left'
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center transition ${
                canScrollLeft
                  ? "hover:bg-white hover:scale-110 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className='w-5 h-5 text-gray-700' />
            </button>

            <div 
              ref={scrollContainerRef}
              onScroll={updateScrollButtons}
              className='flex gap-3 px-2 py-1 overflow-x-auto no-scrollbar'
              style={{ maxWidth: "calc(64px * 4 + 12px * 3 + 16px)" }} // 4 cards + 3 gaps + padding
            >
              {AD_IMAGES.map((image, idx) => (
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  key={image.url}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Show advert ${idx + 1}${!image.active ? " (Past Event)" : ""}`}
                  className={`relative flex-shrink-0 border-2 rounded shadow-md bg-white p-0.5 transition ${
                    idx === activeIdx
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-white opacity-80 hover:scale-105"
                  }`}
                  style={{
                    width: 64,
                    height: 64,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <img
                    src={image.url}
                    alt={`Advert ${idx + 1} thumbnail`}
                    className={`object-cover w-full h-full rounded ${!image.active ? "grayscale" : ""}`}
                  />
                  {!image.active && (
                    <div className='absolute inset-0 bg-black/30 rounded flex items-center justify-center'>
                      <span className='text-white text-[8px] font-medium'>Past</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollThumbnails("right")}
              disabled={!canScrollRight}
              aria-label='Scroll thumbnails right'
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center transition ${
                canScrollRight
                  ? "hover:bg-white hover:scale-110 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className='w-5 h-5 text-gray-700' />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
