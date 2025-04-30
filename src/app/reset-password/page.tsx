'use client'
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic'; 

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  );
}