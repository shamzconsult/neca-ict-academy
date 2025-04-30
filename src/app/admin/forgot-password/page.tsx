"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const sendPasswordResetEmail = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
      
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await sendPasswordResetEmail(email);
      setMessage(data.message || "Password reset link sent to your email");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error sending reset email");
    }
    
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          {message && (
            <p className={`text-sm ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}>
              {message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-[#E02B20] hover:bg-[#e02a20ce]"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/signin" className="text-[#E02B20] hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}