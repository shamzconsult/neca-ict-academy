"use client";

import Image from "next/image";
import { useState } from "react";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import { MdArrowDropDown } from "react-icons/md";
import Link from "next/link";
import { CheckStatusModal } from "./CheckStatusModal";
import { ApplicationReview } from "./ApplicationReview";
import SuccessModal from "./SuccessPage";
import { FiFileText, FiImage, FiX } from 'react-icons/fi';

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

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const clearCvFile = () => {
    setCvFile(null);
  };

  const clearProfileImage = () => {
    setProfileImage(null);
  };

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
    console.log("Form submitted:", formData);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setShowReview(false);
  };

  const handleCheckStatus = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError("");
      setShowReview(true);
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleCloseReview = () => {
    setShowModal(false);
    setShowReview(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-[-50px] left-0 w-[8%] h-[73%] z-0 transform rotate-[-0.47deg] origin-top-left">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png"
          alt="Background Left"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
      </div>
      <div className="hidden lg:block absolute top-[90%] right-0 w-[20%] h-[20%] z-10 transform">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742300250/Background-Pattern_cukkck.png"
          alt="Background Right"
          layout="fill"
          objectFit="cover"
          className="opacity-41"
        />
      </div>

        <div className="relative max-w-7xl mx-auto my-2 p-4 pb-0 bg-white rounded-lg overflow-hidden lg:top-20">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row mt-10 lg:mt-0 justify-between items-center gap-5 lg:mb-30">
              <div className="w-36 h-auto relative right-0 lg:w-48 lg:right-7">
                <Image
                  src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png"
                  alt="NECA ICT ACADEMY Logo"
                  width={144}
                  height={72}
                  className="object-contain w-full h-full cursor-pointer"
                />
              </div>
              <div>
                <h3 className="text-lg text-center md:text-left">
                  Already applied?{" "}
                  <Link
                    href="#"
                    className="underline text-[#27156F] hover:text-[#1a0e4d] transition-colors ml-1"
                    onClick={toggleModal}
                  >
                    Check Status
                  </Link>
                </h3>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-evenly items-start my-10 gap-8">
              <div className="w-full md:w-1/2 md:pr-8">
                <div className="relative w-full h-[300px] mb-6 hidden sm:block">
                  <div className="absolute bg-[#f8fbf9] rounded-full w-3/4 h-full ml-20 z-0 pl-20"></div>
                  <Image
                    src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Online_education_and_virtual_learning_g0fzok.png"
                    alt="Online Education Image"
                    fill
                    className="object-contain relative z-10"
                  />
                </div>
                <div className="lg:mt-58 mt-10 hidden sm:block">
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

              <div className="w-full md:w-1/2 text-center lg:text-left">
                <SubHeading>NECA ICT Academy Application Portal</SubHeading>
                <h2 className="text-2xl font-semibold text-[#27156F] mb-4 mt-6">
                  Register Now!
                </h2>
                <p className="text-gray-600 text-xl mb-7">
                  To apply for our training programs or opportunities, please fill
                  out the form below with accurate information. Ensure all
                  required fields are completed to avoid delays in processing{" "}
                  <br /> your application.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        State
                      </label>
                      <div className="relative">
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
                        >
                          <option value="">Select your state</option>
                          <option value="Abuja">Abuja</option>
                          <option value="Kwara state">Kwara state</option>
                          <option value="Lagos State">Lagos State</option>
                          <option value="Niger State">Niger State</option>
                          <option value="Oyo State">Oyo State</option>
                        </select>
                        <MdArrowDropDown
                          size={24}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
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
                    <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                      Course
                    </label>
                    <div className="relative">
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        Upload CV
                      </label>
                      <div className="relative h-14">
                        <div className="flex items-center gap-3 p-3 h-full border border-[#1E1E1E] rounded-md focus-within:ring focus-within:ring-[#1E1E1E] cursor-pointer">
                          <FiFileText className="text-gray-500 text-xl flex-shrink-0" />
                          <input
                            type="file"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            required
                            onChange={handleCvChange}
                            className="w-full opacity-0 absolute inset-0 cursor-pointer"
                          />
                          {cvFile ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-gray-700 text-sm truncate">{cvFile.name}</span>
                              <button
                                type="button"
                                onClick={clearCvFile}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm truncate">Choose PDF or DOC file</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                        Upload Profile Image
                      </label>
                      <div className="relative h-14">
                        <div className="flex items-center gap-3 p-3 h-full border border-[#1E1E1E] rounded-md focus-within:ring focus-within:ring-[#1E1E1E] cursor-pointer">
                          <FiImage className="text-gray-500 text-xl flex-shrink-0" />
                          <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            required
                            onChange={handleProfileImageChange}
                            className="w-full opacity-0 absolute inset-0 cursor-pointer"
                          />
                          {profileImage ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-gray-700 text-sm truncate">{profileImage.name}</span>
                              <button
                                type="button"
                                onClick={clearProfileImage}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm truncate">Choose image file</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#E02B20] text-white py-3 px-5 rounded-md hover:bg-[#E02B20]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E02B20] focus:ring-opacity-50 cursor-pointer"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/30">
              {!showReview ? (
                <CheckStatusModal
                  email={email}
                  setEmail={setEmail}
                  onCheckStatus={handleCheckStatus}
                  emailError={emailError}
                />
              ) : (
                <ApplicationReview onClose={handleCloseReview} />
              )}
            </div>
          )}
          <SuccessModal isOpen={isSuccessModalOpen} onClose={handleCloseSuccessModal} />
        </div>
    </div>
  );
};

export default ApplicationPortal;