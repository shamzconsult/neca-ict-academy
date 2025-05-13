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
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1747089812949/18572961-48de-4758-9455-38a83b677a5c.png",
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1747089816647/d3363681-5a02-4626-91f8-934a5b183099.png",
];

const STORAGE_KEY = "neca_advert_overlay_dismissed";
const SWITCH_INTERVAL = 5000; // 5 seconds between switches

export const AdvertOverlay: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only show if not dismissed before
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setOpen(true);
    }
  }, []);

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
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTitle asChild>
        <VisuallyHidden>NECA ICT Academy Advert</VisuallyHidden>
      </DialogTitle>
      <DialogContent
        className='w-full sm:max-w-full h-full bg-transparent border-none'
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
              className={`rounded-lg shadow-2xl bg-white h-[80vh] max-h-[80vh] object-contain transition-opacity duration-600 ${
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
