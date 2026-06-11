"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, Lock, Megaphone } from "lucide-react";

export type AnnouncementPreviewItem = {
  title: string;
  url: string;
  active: boolean;
  hidden?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AnnouncementPreviewItem | null;
};

export function AnnouncementPreviewDialog({ open, onOpenChange, item }: Props) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[95vh] gap-0 overflow-hidden p-0 sm:max-w-2xl'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Announcement preview</DialogTitle>
        </DialogHeader>

        <div className='overflow-hidden rounded-lg bg-white'>
          <div className='flex items-center justify-between gap-3 border-b border-[#27156F]/10 bg-gradient-to-r from-[#27156F] to-[#27156F]/90 px-4 py-3 sm:px-5'>
            <div className='flex min-w-0 items-center gap-2.5 text-white'>
              <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15'>
                <Megaphone className='size-4' aria-hidden />
              </span>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold sm:text-base'>
                  {item.title || "Announcements"}
                </p>
                <p className='text-[11px] text-white/75 sm:text-xs'>
                  Homepage popup preview
                </p>
              </div>
            </div>
          </div>

          {item.hidden ? (
            <div className='border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800'>
              Hidden — this flyer will not appear on the homepage.
            </div>
          ) : null}

          <div className='bg-gradient-to-b from-[#DBEAF6]/40 to-white px-3 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5'>
            <div className='relative overflow-hidden rounded-xl border border-[#27156F]/10 bg-white shadow-inner'>
              <img
                src={item.url}
                alt={item.title || "Announcement preview"}
                className={cn(
                  "mx-auto w-full object-contain",
                  "max-h-[min(55dvh,480px)] sm:max-h-[min(65vh,520px)]",
                  !item.active && "grayscale",
                )}
              />
              <span
                className={cn(
                  "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm sm:text-xs",
                  item.active ? "bg-[#27156F]" : "bg-gray-800/80 backdrop-blur-sm",
                )}
              >
                {item.active ? "Open" : "Past event"}
              </span>
            </div>

            <div className='mt-4 flex justify-center'>
              {item.active ? (
                <Button
                  type='button'
                  disabled
                  className='h-10 gap-2 rounded-full bg-[#E02B20] px-6 font-semibold text-white shadow-md disabled:pointer-events-none disabled:opacity-100'
                >
                  Apply Now
                  <ArrowRight className='size-4' />
                </Button>
              ) : (
                <Button
                  type='button'
                  disabled
                  className='h-10 gap-2 rounded-full bg-gray-400 px-6 font-semibold text-white shadow-md disabled:pointer-events-none disabled:opacity-100'
                >
                  Event Ended
                  <Lock className='size-4' />
                </Button>
              )}
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-2 border-t border-[#27156F]/5 bg-[#FBFBFB] px-4 py-3'>
            {item.hidden ? (
              <Badge
                variant='outline'
                className='border-gray-200 bg-gray-100 text-gray-600'
              >
                Hidden
              </Badge>
            ) : null}
            <Badge
              className={cn(
                "border-0 text-[10px] uppercase",
                item.active
                  ? "bg-[#E02B20] text-white"
                  : "bg-[#27156F]/80 text-white",
              )}
            >
              {item.active ? "Open" : "Past"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
