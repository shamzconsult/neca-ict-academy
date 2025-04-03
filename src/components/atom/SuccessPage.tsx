'use client';

// import React, { useState } from "react";
import Image from 'next/image';
import { SubHeading } from "@/components/atom/headers/SubHeading";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6">
        <div className="relative flex flex-col w-full items-center justify-center min-h-screen mx-auto">
          <Image
            src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742551374/tnddp2bamc3iu2pznihy.png"
            alt="Success Icon"
            width={100}
            height={100}
            className='mb-8'
          />
          <SubHeading>Thanks For Registering!</SubHeading>

          <h2 className="text-[#27156F] text-2xl font-semibold mt-6">
            Check Your Email
          </h2>
          <p className='mt-4 text-center text-xl'>You will receive a confirmation email with details <br /> about the next steps.</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default SuccessModal;