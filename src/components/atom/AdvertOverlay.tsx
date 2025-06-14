"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "../visually-hidden";

const AD_IMAGES = [
  // "https://res.cloudinary.com/dtryuudiy/image/upload/v1747153124/ICT_ACADEMY_FLIER_2_1_2_1_yswykd.jpg",
  // "https://res.cloudinary.com/dtryuudiy/image/upload/v1747147393/enrollment/course/mxgu4h5xa295wk4igdr4.webp",
  "https://res.cloudinary.com/dtryuudiy/image/upload/v1748613785/neca_flier_2_2_pgmlai.webp",
  // "https://res.cloudinary.com/dtryuudiy/image/upload/v1747134855/enrollment/course/nod3uf4l2bhrr4fzp9wc.webp",
  "https://res.cloudinary.com/dtryuudiy/image/upload/v1749112300/NECA_ICT_ACADEMY_8_Weeks_AI_Course_FLIER_mqyk7n.jpg",
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

  useEffect(() => {
    if (!open || AD_IMAGES.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % AD_IMAGES.length);
        setIsTransitioning(false);
      }, 300); // Half of the transition duration
    }, SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [open, isHovered]);

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
              src={AD_IMAGES[activeIdx]}
              alt={`Advert ${activeIdx + 1}`}
              className={`rounded-lg shadow-2xl sm:h-[80vh] sm:max-h-[80vh] object-contain transition-opacity duration-600 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          <div className='mt-4 flex justify-center gap-4'>
            {AD_IMAGES.map((src, idx) => (
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                key={src}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Show advert ${idx + 1}`}
                className={`border-2 rounded shadow-md bg-white p-0.5 transition ${
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
                  src={src}
                  alt={`Advert ${idx + 1} thumbnail`}
                  className='object-cover w-full h-full rounded'
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
