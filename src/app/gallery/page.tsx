"use client";

import {
  AddNewGalleryItem,
  GalleryType,
} from "@/components/atom/AddNewGalleryItem";
import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, ChevronDown, Pencil, Trash2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const BACKGROUND_IMAGES = [
  "https://res.cloudinary.com/dtryuudiy/image/upload/v1747140810/899aad12-5c86-4d93-815a-30d3f7f39993_cgix5e.webp",
  "https://res.cloudinary.com/dtryuudiy/image/upload/v1758804540/enrollment/gallery/l7mlld1kaxopafi6suif.jpg",
  // "https://res.cloudinary.com/dtryuudiy/image/upload/v1747141648/image_jxqy5v.webp",
  // "https://res.cloudinary.com/dtryuudiy/image/upload/v1747140614/NECA_DIRECTOR_GENERAL_VISIT_THE_AI_CLASS_VIRTUALLY_DURING_NECA_ICT_ACADEMY_SESSION_WITH_UNCLEBIGBAY_ootply.jpg",
];

const GallerySkeleton = () => {
  return (
    <div className='columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-6'>
      {Array.from({ length: 12 }).map((_, idx) => (
        <div
          key={idx}
          className='mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-[#E02B20]/10 bg-gray-100 animate-pulse'
          style={{ height: idx % 3 === 0 ? 280 : idx % 3 === 1 ? 200 : 240 }}
        />
      ))}
    </div>
  );
};

export default function PhotoAlbumPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [galleryToEdit, setGalleryToEdit] = useState<GalleryType | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    images: File[];
  }>({
    title: "",
    description: "",
    date: "",
    images: [],
  });
  const isAdmin = !!session;
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [bgIndex, setBgIndex] = useState(0);
  const [
    backgroundImagesAndGalleryImages,
    setBackgroundImagesAndGalleryImages,
  ] = useState<string[]>(BACKGROUND_IMAGES);

  const { data: galleryData, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await fetch("/api/gallery", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  });

  const galleryItems = galleryData?.galleryItems;

  useEffect(() => {
    if (galleryItems === undefined) return;

    const heroImages = galleryItems
      .filter((img: GalleryType) => img.useAsHeroBackground)
      .map((img: GalleryType) => img.images[0])
      .filter(Boolean);

    setBackgroundImagesAndGalleryImages(
      heroImages.length > 0 ? heroImages : BACKGROUND_IMAGES,
    );
    setBgIndex(0);
  }, [galleryItems]);
  useEffect(() => {
    if (backgroundImagesAndGalleryImages.length === 0) return;
    const interval = setInterval(() => {
      setBgIndex(
        (prev) => (prev + 1) % backgroundImagesAndGalleryImages.length,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImagesAndGalleryImages.length]);

  const galleryImages = galleryItems ?? [];

  const handleDelete = async (_id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this gallery?"))
      return;

    try {
      const res = await fetch(`/api/gallery/${_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete gallery");
        toast.error("Failed to delete the gallery.");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("gallery deleted successfully");
    } catch (error) {
      console.error("Error deleting gallery: ", error);
      toast.error("Something went wrong.");
    }
  };

  const handleEdit = (gallery: GalleryType) => {
    if (setGalleryToEdit && setFormData && setShowModal) {
      setGalleryToEdit(gallery);
      setFormData({
        title: gallery.title,
        description: gallery.description,
        date: gallery.date,
        images: [],
      });
      setShowModal(true);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 pt-16 lg:pt-[106px] pb-16'>
        {/* Hero Section */}
        <section className='relative w-full h-[50vh] lg:h-[80vh] mb-10 overflow-hidden border-b border-[#E02B20]/10'>
          {backgroundImagesAndGalleryImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === bgIndex ? "opacity-100" : "opacity-0",
              )}
            >
              <img
                src={src}
                alt=''
                aria-hidden
                className={cn(
                  "h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out",
                  index === bgIndex ? "scale-105" : "scale-100",
                )}
              />
            </div>
          ))}

          <div className='absolute inset-0 z-10 bg-gradient-to-t from-[#27156F]/95 via-[#27156F]/50 to-[#27156F]/10' />
          <div className='absolute inset-0 z-10 bg-gradient-to-r from-black/20 to-transparent' />

          <div className='relative z-20 flex h-full flex-col items-center justify-end px-4 pb-10 text-center lg:pb-16'>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E02B20] sm:text-sm'>
              NECA ICT Academy
            </p>
            <h1 className='mb-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl'>
              Gallery Photo Album
            </h1>
            <p className='mb-6 max-w-md text-sm text-white/80 md:text-base'>
              Moments from training sessions, graduations, and community events
            </p>

            {backgroundImagesAndGalleryImages.length > 1 && (
              <div className='mb-5 flex items-center gap-2'>
                {backgroundImagesAndGalleryImages.map((_, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setBgIndex(index)}
                    aria-label={`Show slide ${index + 1}`}
                    aria-current={index === bgIndex ? "true" : undefined}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === bgIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>
            )}

            <ChevronDown
              className='size-7 text-white/70 animate-bounce'
              aria-hidden
            />
          </div>
        </section>
        {isAdmin && (
          <div className='flex max-w-6xl mx-auto justify-between items-center text-center px-2 md:px-0 mb-5'>
            <h3 className='flex items-center gap-2 text-xl font-semibold text-[#27156F]'>
              <ImageIcon className='size-7' />
              Manage Gallery
            </h3>
            <Button
              onClick={toggleModal}
              size='lg'
              className='text-center text-nowrap px-6 py-3.5 cursor-pointer bg-[#E02B20] text-[#FFF] rounded-md hover:bg-[#e02a20ce] duration-300 font-semibold text-sm'
            >
              <Upload /> Upload New Images
            </Button>
          </div>
        )}
        {/* Collage Grid */}
        <section className='max-w-6xl mx-auto px-2 md:px-0'>
          {isLoading ? (
            <GallerySkeleton />
          ) : galleryImages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-16 h-16 mb-4 text-gray-300'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l1.4 1.4m0 0l2.1-2.1a2.25 2.25 0 013.18 0L21 16.5m-8.25-2.1l.443.443c.293.293.767.293 1.06 0l.443-.443'
                />
              </svg>
              <p className='text-lg font-semibold mb-2'>
                No gallery images yet
              </p>
              <p className='text-gray-400'>
                Our gallery is still being updated. Please check back later to
                see what&apos;s new!
              </p>
            </div>
          ) : (
            <div className='columns-2 sm:columns-3 lg:columns-4 gap-4 md:gap-6'>
              {galleryImages.map((img: GalleryType, idx: number) => (
                <div
                  key={img._id}
                  className='relative mb-4 md:mb-6 break-inside-avoid group cursor-pointer overflow-hidden rounded-2xl shadow-md border border-[#E02B20]/10 bg-white transition-all duration-300'
                  onClick={() => setLightboxIndex(idx)}
                  tabIndex={0}
                  aria-label={`View details for ${img.title}`}
                >
                  <img
                    src={img.images[0]}
                    alt={img.description}
                    className='block w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  {isAdmin && (
                    <div className='absolute top-2 right-2 z-30 flex gap-2'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(img);
                        }}
                        className='bg-white/80 hover:bg-white cursor-pointer text-yellow-600 hover:text-yellow-800 p-1 rounded-full shadow transition'
                        title='Edit image'
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img._id, e);
                        }}
                        className='bg-white/80 hover:bg-white text-red-600 cursor-pointer hover:text-red-800 p-1 rounded-full shadow transition'
                        title='Delete image'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className='absolute inset-0 flex flex-col justify-end p-4 pointer-events-none'>
                    <div className='bg-[#27156F] opacity-20 group-hover:opacity-0 transition-all duration-300 absolute inset-0 z-10' />
                    <div className='relative z-20 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <h2 className='text-lg font-semibold text-white drop-shadow mb-1'>
                        {img.title}
                      </h2>
                      <span className='text-xs text-blue-100'>{img.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={galleryImages.flatMap((img: GalleryType) =>
            img.images.map((url) => ({
              src: url,
              title: img.title,
              description: img.description,
            })),
          )}
          plugins={[Thumbnails, Zoom, Slideshow]}
        />
      </main>

      <Footer />
      {showModal && (
        <AddNewGalleryItem
          open={showModal}
          toggleModal={toggleModal}
          setGalleryToEdit={setGalleryToEdit}
          galleryToEdit={galleryToEdit}
          setFormData={setFormData}
          formData={formData}
        />
      )}
    </div>
  );
}
