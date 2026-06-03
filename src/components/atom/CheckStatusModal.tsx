"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/atom/form/FormFeedback";
import { Loader2, MailSearch } from "lucide-react";

interface CheckStatusModalProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onCheckStatus: () => void;
  emailError: string;
  onClose: () => void;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPending) onCheckStatus();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md'>
        <div className='flex flex-col items-center border-b border-[#27156F]/10 bg-[#DBEAF6]/30 px-6 pb-5 pt-8 text-center'>
          <div className='mb-3 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm'>
            <MailSearch className='size-7 text-[#27156F]' />
          </div>
          <p className='text-sm text-gray-600'>
            Enter the email you used when applying
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-6 py-5'>
          <DialogHeader className='mb-4 space-y-1 text-left'>
            <DialogTitle className='text-lg font-bold text-[#27156F] sm:text-xl'>
              Check application status
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-2'>
            <Label htmlFor='check-status-email'>Email address</Label>
            <Input
              id='check-status-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              autoComplete='email'
              disabled={isPending}
              aria-invalid={!!emailError}
              className='h-11 border-[#27156F]/15 bg-white'
            />
            <FieldError message={emailError} />
          </div>

          <DialogFooter className='mt-6 flex-col gap-2 border-0 p-0 sm:flex-row sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isPending}
              className='w-full border-[#27156F]/20 sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending || !email.trim()}
              className='w-full gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90 sm:w-auto'
            >
              {isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                "Check status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
