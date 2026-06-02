"use client";

import { useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const router = useRouter();

  const handleConfirm = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-[#E02B20] font-semibold text-lg text-center'>
            End Session
          </DialogTitle>
        </DialogHeader>
        <p className='text-center'>Are you sure you want to logout?</p>
        <DialogFooter className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button
            variant='outline'
            onClick={onClose}
            type='button'
            className='border-[#27156F]/20'
          >
            No, Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            type='button'
            className='gap-2 bg-[#E02B20] text-white hover:bg-[#E02B20]/90'
          >
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
