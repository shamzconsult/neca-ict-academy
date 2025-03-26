'use client';

import Image from 'next/image';
import { SubHeading } from "@/components/atom/headers/SubHeading";

const SuccessComponent = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
    
      <div className="fixed top-0 left-0 w-1/4 h-full z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png"
          alt="Background Left"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-40"
          priority
        />
      </div>

      
      <div className="hidden lg:block fixed top-0 right-0 w-1/3 h-full z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/v1742225179/Rectangle_4383_akoej5.png"
          alt=""
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="absolute top-20 left-10 lg:left-40 lg:right-20 w-full p-6 z-20 flex lg:mb-20">
          <Image
            src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png"
            alt="Success Icon"
            width={200}
            height={200}
          />
        </div>
        <div className="w-full max-w-md p-8 mx-4 bg-white items-center justify-center text-center gap-3 lg:mt-60 lg:mb-30">
        
            <div className="mb-10 flex justify-center">
            <Image
              src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742551374/tnddp2bamc3iu2pznihy.png"
              alt="Success Icon"
              width={80}
              height={80}
            />
            </div>
          <SubHeading>Thanks For Registering!</SubHeading>
          <br />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#27156F]">
              Check Your Email
            </h2>
            <p className="text-gray-600">
              You will receive a confirmation email with details about the next steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessComponent;