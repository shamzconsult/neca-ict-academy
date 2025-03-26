import React from "react";

interface CheckStatusModalProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onCheckStatus: () => void;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({
  email,
  setEmail,
  onCheckStatus,
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <h2 className="text-[15px] text-[#27156F] font-semibold mb-4">Check your Application Status.</h2>
        <label htmlFor="" className="text-[#1E1E1E]">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 mt-2"
        />
        <div className="flex justify-center space-x-2">
          <button
            onClick={onCheckStatus}
            className="w-full bg-[#E02B20] text-white py-2.5 px-5 rounded-md hover:bg-[#C0241A] transition-colors"
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  );
};
