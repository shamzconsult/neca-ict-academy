import React from "react";
import { FiX } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface CheckStatusModalProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onCheckStatus: () => void;
  emailError: string;
  onClose: () => void; // Add onClose prop
  isPending: boolean;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({
  email,
  setEmail,
  onCheckStatus,
  emailError,
  onClose,
  isPending,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='z-[999999999]'>
        <DialogHeader>
          <DialogTitle className='text-[17px] text-[#27156F] font-bold'>
            Check your application status.
          </DialogTitle>
        </DialogHeader>
        <label htmlFor='email' className='text-[#1E1E1E]'>
          Email Address
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          className={`w-full p-3 border ${
            emailError ? "border-red-500" : "border-gray-300"
          } rounded-md`}
        />
        {emailError && <p className='text-red-500 text-sm'>{emailError}</p>}
        <div className='flex justify-center space-x-2'>
          <button
            onClick={onCheckStatus}
            className='w-full bg-[#E02B20] text-white py-2.5 px-5 rounded-md hover:bg-[#C0241A] transition-colors cursor-pointer'
          >
            {isPending ? "Checking..." : "Check Status"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
