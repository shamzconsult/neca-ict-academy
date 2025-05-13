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
        <DialogFooter>
          <Button variant='secondary' onClick={onClose} type='button'>
            No, Cancel
          </Button>
          <Button onClick={handleConfirm} type='button' variant='destructive'>
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
