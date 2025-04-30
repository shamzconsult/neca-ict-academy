"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPasswordForm token={token} />
    </div>
  );
}