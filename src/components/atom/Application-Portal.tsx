"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { MdArrowDropDown } from "react-icons/md";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  gender: string;
  course: string;
}

const ApplicationPortal = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    gender: "",
    course: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  // const timelineSteps = [
  //   { step: 1, label: 'Application' },
  //   { step: 2, label: 'Interview' },
  //   { step: 3, label: 'Selection' }
  // ];s`

  return (
    <div>
      <div className="absolute top-0 left-0 w-1/5 h-2/2 z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png"
          alt="Background Left"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4383_akoej5.png"
          alt="Background Right"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>
      <div className="absolute top-0 right-0 w-1/7 mt-180 h-full z-0">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742300250/Background-Pattern_cukkck.png"
          alt="Background Right"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>
      <div className="relative max-w-6xl mx-auto my-20 mt-[150px] p-6 bg-white rounded-lg overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="w-48 h-auto relative">
              <Image
                src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/20250212_180601_1_w6sgpi.png"
                alt="NECA ICT ACADEMY Logo"
                width={192}
                height={96}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg">
                Already applied?{" "}
                <Link
                  href="#"
                  className="underline text-[#27156F] hover:text-[#1a0e4d] transition-colors"
                >
                  Check Status
                </Link>
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-evenly items-start gap-8">
            <div className="w-full md:w-1/2 md:pr-8">
              <div className="relative w-full h-[300px] mb-6">
                <div className="absolute bg-[#f8fbf9] rounded-full w-3/4 h-full ml-20 z-0 pl-20"></div>
                <Image
                  src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Online_education_and_virtual_learning_g0fzok.png"
                  alt="Online Education Image"
                  fill
                  className="object-contain relative z-10"
                />
              </div>
              <div className="lg:mt-55">
                <h1 className="text-xl font-semibold text-left text-[#1E1E1E] mb-5 mt-10 pl-2">
                  Application Timeline
                </h1>
                <div className="flex gap-7 items-center">
                  <div className=" bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1">
                    <p>1</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#525252] w-2 h-1"></div>
                    <div className="bg-[#525252] w-3 h-1"></div>
                    <div className="bg-[#525252] w-4 h-1"></div>
                    <div className="bg-[#525252] w-5 h-1"></div>
                  </div>
                  <div className="bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1">
                    <p>2</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#525252] w-2 h-1"></div>
                    <div className="bg-[#525252] w-3 h-1"></div>
                    <div className="bg-[#525252] w-4 h-1"></div>
                    <div className="bg-[#525252] w-5 h-1"></div>
                  </div>
                  <div className="bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1">
                    <p>3</p>
                  </div>
                </div>
                <div className="flex lg:gap-23 gap-4 mt-4 items-center">
                  <p>Application</p>
                  <p>Interview</p>
                  <p>Selection</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <SubHeading>Application Form</SubHeading>
              <h2 className="text-2xl font-semibold text-[#27156F] mb-4 mt-6">
                Register Now!
              </h2>
              <p className="text-gray-600 text-xl mb-7">
                To apply for our training programs or opportunities, please fill
                out the form below with accurate information. Ensure all
                required fields are completed to avoid delays in processing{" "}
                <br /> your application.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="state"
                    >
                      State
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer appearance-none"
                      >
                        <option value="">Select your state</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kwara state">Kwara state</option>
                        <option value="Lagos State">Lagos State</option>
                      </select>
                      <MdArrowDropDown
                        size={24}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="gender"
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer appearance-none"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <MdArrowDropDown
                        size={24}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="course"
                  >
                    Course
                  </label>
                  <div className="relative">
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer appearance-none"
                    >
                      <option value="">Select a course</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                    <MdArrowDropDown
                      size={24}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E02B20] text-white py-2.5 px-5 rounded-md hover:bg-[#E02B20] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E02B20] focus:ring-opacity-50 cursor-pointer"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPortal;
