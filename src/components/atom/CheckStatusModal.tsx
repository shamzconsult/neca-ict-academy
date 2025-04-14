import React from "react";
import { FiX } from "react-icons/fi"; // Import the close icon

interface CheckStatusModalProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onCheckStatus: () => void;
  emailError: string;
  onClose: () => void; // Add onClose prop
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({
  email,
  setEmail,
  onCheckStatus,
  emailError,
  onClose, // Destructure onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px] relative">
      
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <h2 className="text-[17px] text-[#27156F] font-bold mb-4">
          Check your application status.
        </h2>
        <label htmlFor="email" className="text-[#1E1E1E]">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`w-full p-3 border ${
            emailError ? "border-red-500" : "border-gray-300"
          } rounded-md mb-1 mt-2`}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={onCheckStatus}
            className="w-full bg-[#E02B20] text-white py-2.5 px-5 rounded-md hover:bg-[#C0241A] transition-colors cursor-pointer"
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  );
};