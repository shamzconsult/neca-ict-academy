'use client';

import Image from 'next/image';
import { SubHeading } from '@/components/atom/headers/SubHeading';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-50'
      onClick={onClose}>
      <div
        className='relative flex flex-col w-full items-center justify-center min-h-screen mx-auto'
        onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-gray-900 cursor-pointer'>
          ✕
        </button>

        <div className='flex flex-col items-center justify-center text-center w-full max-w-lg'>
          <Image
            src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742551374/tnddp2bamc3iu2pznihy.png'
            alt='Success Icon'
            width={120}
            height={120}
            className='mb-6'
          />
          <SubHeading>Thanks For Registering!</SubHeading>

          <h2 className='text-[#27156F] text-3xl font-semibold mt-4'>Check Your Email</h2>
          <p className='mt-4 text-gray-600 text-xl'>You will receive a confirmation email with details about the next steps.</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
