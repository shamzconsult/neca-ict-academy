"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SignIn() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isSignedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem("isSignedIn", "true");
      router.push("/admin/dashboard");
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Wrong email or password",
        showConfirmButton: false,
        timer: 1500,
      });
    }
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

            <Button
              type="submit"
              className="btn text-white font-semibold cursor-pointer bg-[#E02B20] hover:bg-[#e02a20ce] w-full py-2.5"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
