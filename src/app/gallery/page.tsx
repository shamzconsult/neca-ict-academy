"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/atom/Navbar";
import { Footer } from "@/components/atom/Footer";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import { useSession } from "next-auth/react";
import { Pencil, Trash2, Upload } from "lucide-react";
import {
  AddNewGalleryItem,
  GalleryType,
} from "@/components/atom/AddNewGalleryItem";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
      {Array.from({ length: 12 }).map((_, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl shadow-md border border-[#E02B20]/10 bg-gray-100 animate-pulse
            ${
              idx % 7 === 0
                ? "row-span-2 col-span-2 md:col-span-2 md:row-span-2"
                : ""
            }
            ${idx % 11 === 0 ? "col-span-2" : ""}
          `}
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
  const backgroundImages = [
    "https://res.cloudinary.com/dtryuudiy/image/upload/v1747140810/899aad12-5c86-4d93-815a-30d3f7f39993_cgix5e.webp",
    "https://res.cloudinary.com/dtryuudiy/image/upload/v1747141648/image_jxqy5v.webp",
    "https://res.cloudinary.com/dtryuudiy/image/upload/v1747140614/NECA_DIRECTOR_GENERAL_VISIT_THE_AI_CLASS_VIRTUALLY_DURING_NECA_ICT_ACADEMY_SESSION_WITH_UNCLEBIGBAY_ootply.jpg",
  ];
  const [bgIndex, setBgIndex] = useState(0);

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

  const galleryImages = galleryData?.galleryItems || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[106px] pb-16">
        {/* Hero Section */}
        <section className="w-full flex items-end h-[50vh] lg:h-[80vh] py-12 mb-10 border-b border-[#E02B20]/10 relative overflow-hidden">
          {/* Hero Background Image */}
          <div
            className="absolute inset-0 z-0 opacity-45 transition-all duration-1000"
            style={{
              backgroundImage: `url('${backgroundImages[bgIndex]}')`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              transition: "background-image 1s ease-in-out",
            }}
          />
          <div className="absolute inset-0 z-10 bg-[#27156F] opacity-20" />
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <h1
              className="
                text-4xl md:text-[3rem] font-extrabold text-[#27156F]
                mb-3 tracking-tight drop-shadow-2xl shadow-black
                bg-white/80 px-8 py-4 rounded-xl inline-block
                border-2 border-[#27156F]/20
                backdrop-blur-sm
                mx-auto
              "
            >
              Gallery Photo Album
            </h1>
            <div className="flex justify-center mt-2">
              <svg
                className="w-8 h-8 text-[#27156F] animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </section>
        {isAdmin && (
          <div className="flex max-w-6xl mx-auto justify-between items-center text-center px-2 md:px-0 mb-5">
            <h3 className="text-xl font-semibold text-gray-700">
              Manage Gallery
            </h3>
            <Button
              onClick={toggleModal}
              size="lg"
              className="text-center text-nowrap px-6 py-3.5 cursor-pointer bg-[#E02B20] text-[#FFF] rounded-md hover:bg-[#e02a20ce] duration-300 font-semibold text-sm"
            >
              <Upload /> Upload New Images
            </Button>
          </div>
        )}
        {/* Collage Grid */}
        <section className="max-w-6xl mx-auto px-2 md:px-0">
          {isLoading ? (
            <GallerySkeleton />
          ) : galleryImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mb-4 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l1.4 1.4m0 0l2.1-2.1a2.25 2.25 0 013.18 0L21 16.5m-8.25-2.1l.443.443c.293.293.767.293 1.06 0l.443-.443"
                />
              </svg>
              <p className="text-lg font-semibold mb-2">
                No gallery images yet
              </p>
              <p className="text-gray-400">
                Our gallery is still being updated. Please check back later to
                see what&apos;s new!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
              {galleryImages.map((img: GalleryType, idx: number) => (
                <div
                  key={idx}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-md border border-[#E02B20]/10 bg-white transition-all duration-300
                    ${
                      idx % 7 === 0
                        ? "row-span-2 col-span-2 md:col-span-2 md:row-span-2"
                        : ""
                    }
                    ${idx % 11 === 0 ? "col-span-2" : ""}
                    `}
                  onClick={() => setLightboxIndex(idx)}
                  tabIndex={0}
                  aria-label={`View details for ${img.title}`}
                >
                  <img
                    src={img.images[0]}
                    alt={img.description}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    style={{ aspectRatio: idx % 7 === 0 ? "2/2" : "1/1" }}
                  />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-30 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(img);
                        }}
                        className="bg-white/80 hover:bg-white cursor-pointer text-yellow-600 hover:text-yellow-800 p-1 rounded-full shadow transition"
                        title="Edit image"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img._id, e);
                        }}
                        className="bg-white/80 hover:bg-white text-red-600 cursor-pointer hover:text-red-800 p-1 rounded-full shadow transition"
                        title="Delete image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none">
                    <div className="bg-[#27156F] opacity-20 group-hover:opacity-0 transition-all duration-300 absolute inset-0 z-10" />
                    <div className="relative z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h2 className="text-lg font-semibold text-white drop-shadow mb-1">
                        {img.title}
                      </h2>
                      <span className="text-xs text-blue-100">{img.date}</span>
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
            }))
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
