"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const router = useRouter();

  const handleConfirm = () => {
    localStorage.removeItem("isSignedIn");
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] md:w-[450px]">
        <h2 className="text-[#E02B20] font-semibold text-lg text-center">
          Logout
        </h2>
        <p className="text-center mt-2">Are you sure you want to logout?</p>
        <div className="flex flex-col gap-2 md:flex-row justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-[#525252] cursor-pointer text-white px-4 py-2 rounded w-full md:w-[45%]"
          >
            No, Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-[#E02B20] cursor-pointer text-white px-4 py-2 rounded w-full md:w-[45%]"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};
