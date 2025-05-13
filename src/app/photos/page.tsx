"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/atom/Navbar";
import { Footer } from "@/components/atom/Footer";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";

const IMAGES = [
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114948320/e69d2f68-72b3-4b68-a4bd-4d8ecac6887b.jpeg",
    title: `Photo #1`,
    date: `2024-06-01`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114958862/ed22696a-9b1f-4f4c-8c5b-378876c3740e.jpeg",
    title: `Photo #2`,
    date: `2024-06-02`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114957059/5467bbc5-999f-4785-8b62-63bb1542e3e3.jpeg",
    title: `Photo #3`,
    date: `2024-06-03`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114955415/5e1da090-ded0-4650-aaeb-1db6f8b0bf8c.jpeg",
    title: `Photo #4`,
    date: `2024-06-04`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114953408/1fd0cb67-41ef-4a36-b6a4-df80edb4ae44.jpeg",
    title: `Photo #5`,
    date: `2024-06-05`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
  {
    src: "https://cdn.hashnode.com/res/hashnode/image/upload/v1747114950213/34df36b7-88c3-4a9a-b8be-00c54253d723.jpeg",
    title: `Photo #6`,
    date: `2024-06-06`,
    description: `A memorable moment from our activities.`,
    width: 800,
    height: 600,
  },
];

export default function PhotoAlbumPage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [images, setImages] = useState(IMAGES);

  // Example infinite scroll: load more images (replace with your real fetch)
  const loadMorePhotos = () => {
    // Simulate loading more (repeat the same images for demo)
    setImages((prev) => [...prev, ...IMAGES]);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 pt-16 lg:pt-[106px] pb-16'>
        {/* Hero Section */}
        <section className='w-full flex items-center lg:h-[500px] py-12 mb-10 border-b border-[#E02B20]/10 relative overflow-hidden'>
          {/* Hero Background Image */}
          <div
            className='absolute inset-0 z-0 opacity-30'
            style={{
              backgroundImage:
                "url('https://cdn.hashnode.com/res/hashnode/image/upload/v1747116422583/899aad12-5c86-4d93-815a-30d3f7f39993.webp')",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          />
          <div className='absolute inset-0 z-10 bg-[#27156F] opacity-40' />
          <div className='max-w-6xl mx-auto px-4 text-center relative z-10'>
            <h1 className='text-4xl md:text-[5rem] font-extrabold text-[#27156F] mb-3 tracking-tight drop-shadow'>
              Photo Album
            </h1>
            {/* <p className='text-lg text-[#27156F]/80 max-w-2xl mx-auto'>
              A visual journey through our teaching, workshops, and community
              activities. Click any photo to view it larger.
            </p> */}
          </div>
        </section>
        {/* Collage Grid with Infinite Scroll */}
        <section className='max-w-6xl mx-auto px-2 md:px-4'>
          <section className='max-w-6xl mx-auto px-2 md:px-4'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]'>
              {IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-md border border-[#E02B20]/10 bg-white transition-all duration-300
                  ${idx % 7 === 0 ? "row-span-2 col-span-2 md:col-span-2 md:row-span-2" : ""}
                  ${idx % 11 === 0 ? "col-span-2" : ""}
                  `}
                  onClick={() => setLightboxIndex(idx)}
                  tabIndex={0}
                  aria-label={`View details for ${img.title}`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    style={{ aspectRatio: idx % 7 === 0 ? "2/2" : "1/1" }}
                  />
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
          </section>
        </section>
        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={images.map((img) => ({
            src: img.src,
            description: img.description,
            title: img.title,
          }))}
          index={lightboxIndex}
          plugins={[Thumbnails, Zoom, Slideshow]}
        />
      </main>
      <Footer />
    </div>
  );
}
