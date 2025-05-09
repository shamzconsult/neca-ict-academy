"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import Link from "next/link";
import { CheckStatusModal } from "./CheckStatusModal";
import { ApplicationReview } from "./ApplicationReview";
import SuccessModal from "./SuccessPage";
import { FileUploader } from "@/components/atom/FileUploader";
import { MdArrowDropDown, MdImage, MdDescription } from "react-icons/md";
import {
  genderOptions,
  levelOptionsMap,
  states,
  statusOptionsMap,
} from "@/const";
import { CourseType } from "@/types";
import { useSearchParams } from "next/navigation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  course: string;
  cohort: string;
  level: string;
  status: string;
}

type ApplicationFormProps = {
  _id: string;
  name: string;
}[];

const ApplicationPortal = ({
  cohorts,
  courses,
}: {
  cohorts: ApplicationFormProps;
  courses: CourseType[];
}) => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    state: "",
    gender: "",
    course: "",
    cohort: "",
    level: levelOptionsMap.application,
    status: statusOptionsMap.pending,
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (course && typeof course === "string") {
      setFormData((prevData) => ({
        ...prevData,
        course,
      }));
    }
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("course", formData.course);
    formDataToSend.append("cohort", formData.cohort);
    formDataToSend.append("level", formData.level);
    formDataToSend.append("status", formData.status);

    if (cvFile) formDataToSend.append("cv", cvFile);
    if (profileImage) formDataToSend.append("profilePicture", profileImage);

    startTransition(async () => {
      try {
        const res = await fetch("/api/applicant", {
          method: "POST",
          body: formDataToSend,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Submission failed:", errorData);
          // alert(`Error: ${errorData.message || "Submission failed"}`);
          return;
        }
        setIsSuccessModalOpen(true);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          state: "",
          gender: "",
          course: "",
          cohort: "",
          level: levelOptionsMap.application,
          status: statusOptionsMap.pending,
        });

        setCvFile(null);
        setProfileImage(null);
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error - please try again");
      }
    });
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
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-[8%] h-[73%] z-[999] transform rotate-[-0.47deg] origin-top-left">
        <Image
          src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png"
          alt="Background Left"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          priority
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
      <div className="h-screen overflow-hidden">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50">
          <div className="max-w-[1550px] mx-auto px-4 py-4">
            <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
              <Link href="/" className="w-36 lg:w-48">
                <Image
                  src="https://res.cloudinary.com/daqmbfctv/image/upload/e_improve/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png"
                  alt="NECA ICT ACADEMY Logo"
                  width={144}
                  height={72}
                  className="object-contain w-full h-full cursor-pointer"
                />
              </Link>
              <div>
                <h3 className="text-lg">
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
          </div>
        </header>

        {/* Main Content */}
        {cohorts.length > 0 ? (
          <div className="flex h-[calc(100vh-88px)] mt-[88px]">
            {/* Static Left Side */}
            <div className="hidden lg:block w-1/2 fixed left-0 top-[88px] bottom-0 bg-white p-8">
              <div className="h-full flex flex-col justify-between pl-[15%]">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full flex items-center justify-center">
                  <div className="absolute bg-[#f8fbf9] rounded-full w-3/4 h-full ml-20 z-0" />
                  <img
                    src="https://res.cloudinary.com/dtryuudiy/image/upload/v1746617511/Online_education_and_virtual_learning_g0fzok_tcay9v.png"
                    alt="Online Education Image"
                    className="object-contain relative z-10"
                  />
                </div>

                {/* Timeline Section */}
                <div className="pl-2 mb-8">
                  <h1 className="text-xl font-semibold text-[#1E1E1E] mb-8">
                    Application Timeline
                  </h1>
                  <div className="flex gap-7 items-center">
                    <div className="bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1">
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
                  <div className="flex gap-16 mt-4 items-center">
                    <p>Application</p>
                    <p>Interview</p>
                    <p>Selection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:ml-[50%] bg-white overflow-y-auto h-full pt-5">
              <div className="max-w-2xl mx-auto px-8 py-8 lg:pr-[10%] text-center lg:text-left">
                <SubHeading>NECA ICT Academy Application Portal</SubHeading>
                <h2 className="text-2xl font-semibold text-[#27156F] mb-4 mt-6">
                  Register Now!
                </h2>
                <p className="text-gray-600 text-xl mb-7">
                  To apply for our training programs or opportunities, please
                  fill out the form below with accurate information. Ensure all
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
                            disabled={isPending}
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
                            disabled={isPending}
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
                        disabled={isPending}
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
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        disabled={isPending}
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
                          disabled={isPending}
                          className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
                        >
                          <option value="">Select your state</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
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
                          disabled={isPending}
                          className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none capitalize"
                        >
                          <option value="">Select gender</option>

                          {genderOptions.map((gender) => {
                            return (
                              <option key={gender} value={gender}>
                                {gender}
                              </option>
                            );
                          })}
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
                      Cohorts
                    </label>
                    <div className="relative">
                      <select
                        name="cohort"
                        value={formData.cohort}
                        onChange={handleInputChange}
                        required
                        disabled={isPending}
                        className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
                      >
                        <option value="">
                          {!cohorts || cohorts.length === 0
                            ? "No cohorts in session"
                            : "Select a cohort"}
                        </option>

                        {cohorts.length > 0 &&
                          cohorts.map((cohort) => (
                            <option key={cohort._id} value={cohort._id}>
                              {cohort.name}
                            </option>
                          ))}
                      </select>
                      <MdArrowDropDown
                        size={24}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                      />
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
                        disabled={isPending}
                        className="w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none"
                      >
                        <option value="">
                          {!courses || courses.length === 0
                            ? "No courses available"
                            : "Select a course"}
                        </option>
                        {courses.length > 0 &&
                          courses.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.title}
                            </option>
                          ))}
                      </select>
                      <MdArrowDropDown
                        size={24}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploader
                      label="Upload CV"
                      name="cv"
                      required
                      accept=".pdf,.doc,.docx"
                      icon={<MdDescription />}
                      placeholder="Upload your CV"
                      onFileChange={setCvFile}
                      currentFile={cvFile}
                    />

                    <FileUploader
                      label="Upload Profile Image"
                      name="profileImage"
                      required
                      accept="image/*"
                      icon={<MdImage />}
                      placeholder="Upload your image"
                      onFileChange={setProfileImage}
                      currentFile={profileImage}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full bg-[#E02B20] text-white py-3 px-5 rounded-md hover:bg-[#E02B20]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E02B20] focus:ring-opacity-50 cursor-pointer ${isPending ? "opacity-75" : ""}`}
                  >
                    {isPending ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen">
            <h1>No Cohort in Session</h1>
            <p>
              Join our
              <a target="blank" href="" className="text-red-500 underline px-1">
                channel
              </a>
              for updates on next cohort
            </p>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/30">
            {!showReview ? (
              <CheckStatusModal
                email={email}
                setEmail={setEmail}
                onCheckStatus={handleCheckStatus}
                emailError={emailError}
                onClose={toggleModal}
              />
            ) : (
              <ApplicationReview onClose={handleCloseReview} />
            )}
          </div>
        )}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
        />
      </div>
    </div>
  );
};

export default ApplicationPortal;
