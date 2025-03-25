import React, { useState } from "react";

export const CheckStatusModal = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div className="fixed lg:sticky w-full h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <p className="text-[#27156F] font-bold mb-4">Check your application status.</p>
        <div className="space-y-4 ">
          <div>
            <label className="block text-[#1E1E1E] font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="Enter your email address"
            />
          </div>
          <div className="flex justify-center space-x-2">
            {/* <button
                  className="px-4 py-2 bg-black text-white rounded-md"
                  onClick={toggleModal}
                >
                  Cancel
                </button> */}
            <button
              onClick={toggleModal}
              className="px-10 py-1.5 bg-[#E02B20] text-white rounded-md cursor-pointer mt-6"
            >
              Check Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
