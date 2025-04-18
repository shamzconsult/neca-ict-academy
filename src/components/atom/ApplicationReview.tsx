import React from "react";

interface ApplicationReviewProps {
  onClose: () => void;
}

export const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed lg:sticky w-full h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <p className="text-[#27156F] text-center font-bold mb-6">Your Application is Under Review</p>
        <div className="space-y-4 ">
          <div>
            <p className="block text-sm text-center font-semibold mb-1 mx-auto">
            Your application is currently under review. We will notify you once a <br /> decision has been made. <br /> 
            Thank you for your patience!
            </p>
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={onClose}
              className="px-10 py-1.5 bg-[#E02B20] text-white rounded-md cursor-pointer mt-6"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
