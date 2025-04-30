'use client'
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordWrapper />
      </Suspense>
    );
  }

 function ResetPasswordWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  );
}