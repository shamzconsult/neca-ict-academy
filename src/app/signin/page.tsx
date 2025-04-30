"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function SignIn() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const csrfResponse = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfResponse.json();

    const result = await signIn("credentials", {
      redirect: false,
      email: inputEmail,
      csrfToken,
      password: inputPassword,
      callbackUrl: "/admin/dashboard",
    });

    if (result?.error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Invalid password or email address",
        showConfirmButton: false,
        timer: 2500,
      });
    } else {
      router.push("/admin/dashboard");
    }

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-3xl mx-auto text-center text-2xl pb-12 md:pb-20 font-bold">
          <h1 className="">Welcome back admin.</h1>
          <h2 className="text-[#E02B20] mt-1">
            Sign in to add and edit content.
          </h2>
        </div>

        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-2"
              />
            </div>

            <div className="flex flex-col mb-4">
              <Label>Password</Label>
              <div className="relative w-full mt-2">
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="text-right mb-4">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-[#E02B20] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="btn text-white font-semibold cursor-pointer bg-[#E02B20] hover:bg-[#e02a20ce] w-full py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
