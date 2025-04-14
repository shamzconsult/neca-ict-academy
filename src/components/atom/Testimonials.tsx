import { testimonials } from "@/const/testimonies";
import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";
import { SubHeading } from "./headers/SubHeading";
import { Heading } from "./headers/Heading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0%",
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_: number, newIndex: number) => setCurrentIndex(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className="w-full my-16 lg:mt-28 py-32"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/v1741325756/Group_2_pbhqj7.png')",
      }}
    >
      <div className="max-w-6xl mx-auto py-12 px-6 text-center">
        <div className="max-w-5xl mx-auto text-center">
          <SubHeading>Testimonials</SubHeading>
          <Heading>
            Hear from Our Successful Graduates - Real Stories, Real Impact!
          </Heading>
        </div>
        <div className="relative max-w-6xl mx-auto mt-8">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-6 text-left max-w-sm transition-all text-[#000000] duration-500 ${
                  index === currentIndex
                    ? "scale-100 z-10 mb-3"
                    : "scale-90 opacity-60"
                }`}
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h4 className="text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-sm">
                      {testimonial.role}
                      <span className="text-yellow-500">
                        {"★".repeat(testimonial.rating)}
                        {"★".repeat(5 - testimonial.rating)}
                      </span>
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mt-2 text-center">
                  {testimonial.title}
                </h4>
                <p className="mt-2 text-sm text-center">{testimonial.review}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};
