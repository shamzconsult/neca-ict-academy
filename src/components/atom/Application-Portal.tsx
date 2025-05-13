"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

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
  cv: File | null;
  profileImage: File | null;
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

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      state: "",
      gender: "",
      course: course || "",
      cohort: "",
      level: levelOptionsMap.application,
      status: statusOptionsMap.pending,
      cv: null,
      profileImage: null,
    },
  });

  useEffect(() => {
    if (course && typeof course === "string") {
      setValue("course", course);
    }
  }, [course, setValue]);

  // Modal and status state
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [applicantStatus, setApplicantStatus] = useState<any>(null);

  // React Query: Application submission
  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "cv" || key === "profileImage") {
          if (value)
            formDataToSend.append(
              key === "profileImage" ? "profilePicture" : key,
              value as File
            );
        } else {
          formDataToSend.append(key, value as string);
        }
      });
      const res = await fetch("/api/applicant", {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setIsSuccessModalOpen(true);
      reset();
    },
    onError: (error: any) => {
      alert(error.message || "Submission failed");
    },
  });

  // React Query: Check status
  const checkStatusMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`/api/applicant/status/${email}`);
      if (res.status === 404) {
        throw new Error("No application found for this email.");
      }
      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setApplicantStatus(data);
      setStatusError("");
      setShowReview(true);
    },
    onError: (error: any) => {
      setStatusError(error.message);
      setApplicantStatus(null);
      setShowReview(true);
    },
  });

  const toggleModal = () => {
    setShowModal(!showModal);
    setShowReview(false);
    setStatusError("");
    setEmailError("");
  };

  const handleCheckStatus = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      checkStatusMutation.mutate(email);
      setEmail("");
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleCloseReview = () => {
    setShowModal(false);
    setShowReview(false);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className='relative min-h-screen bg-white overflow-hidden'>
      {/* Background Elements */}
      <div className='fixed top-0 left-0 w-[8%] h-[73%] z-[99] transform rotate-[-0.47deg] origin-top-left'>
        <Image
          src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png'
          alt='Background Left'
          layout='fill'
          objectFit='cover'
          className='opacity-40'
          priority
        />
      </div>
      <div className='hidden lg:block absolute top-[90%] right-0 w-[20%] h-[20%] z-[5] transform'>
        <Image
          src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742300250/Background-Pattern_cukkck.png'
          alt='Background Right'
          layout='fill'
          objectFit='cover'
          className='opacity-41'
        />
      </div>
      <div className='h-screen overflow-hidden'>
        {/* Fixed Header */}
        <header className='fixed top-0 left-0 right-0 bg-white'>
          <div className='max-w-[1550px] mx-auto px-4 py-4'>
            <div className='flex flex-col gap-5 md:flex-row justify-between items-center'>
              <Link
                href='/'
                className='w-36 lg:w-48 relative lg:left-[100px] 2xl:left-0'
              >
                <Image
                  src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png'
                  alt='NECA ICT ACADEMY Logo'
                  width={144}
                  height={72}
                  className='object-contain w-full h-full cursor-pointer'
                />
              </Link>
              <div>
                <h3 className='text-lg'>
                  Already applied?{" "}
                  <Link
                    href='#'
                    className='underline text-[#27156F] hover:text-[#1a0e4d] transition-colors ml-1'
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
          <div className='flex h-[calc(100vh-88px)] mt-[88px]'>
            {/* Static Left Side */}
            <div className='hidden lg:block w-1/2 fixed left-0 top-[88px] bottom-0 bg-white p-8'>
              <div className='h-full flex flex-col justify-between pl-[15%]'>
                {/* Image Section */}
                <div className='relative aspect-[4/3] w-full flex items-center justify-center'>
                  <div className='absolute bg-[#f8fbf9] rounded-full w-3/4 h-full ml-20 z-0' />
                  <img
                    src='https://res.cloudinary.com/dtryuudiy/image/upload/v1746617511/Online_education_and_virtual_learning_g0fzok_tcay9v.png'
                    alt='Online Education Image'
                    className='object-contain relative z-10'
                  />
                </div>

                {/* Timeline Section */}
                <div className='pl-2 mb-8'>
                  <h1 className='text-xl font-semibold text-[#1E1E1E] mb-8'>
                    Application Timeline
                  </h1>
                  <div className='flex gap-7 items-center'>
                    <div className='bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1'>
                      <p>1</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <div className='bg-[#525252] w-2 h-1'></div>
                      <div className='bg-[#525252] w-3 h-1'></div>
                      <div className='bg-[#525252] w-4 h-1'></div>
                      <div className='bg-[#525252] w-5 h-1'></div>
                    </div>
                    <div className='bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1'>
                      <p>2</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <div className='bg-[#525252] w-2 h-1'></div>
                      <div className='bg-[#525252] w-3 h-1'></div>
                      <div className='bg-[#525252] w-4 h-1'></div>
                      <div className='bg-[#525252] w-5 h-1'></div>
                    </div>
                    <div className='bg-[#525252] text-white text-center items-center w-8 h-8 rounded-full pt-1'>
                      <p>3</p>
                    </div>
                  </div>
                  <div className='flex gap-16 mt-4 items-center'>
                    <p>Application</p>
                    <p>Interview</p>
                    <p>Selection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full lg:w-1/2 lg:ml-[50%] bg-white overflow-y-auto h-full pt-5'>
              <div className='max-w-2xl mx-auto px-8 py-8 lg:pr-[10%] text-center lg:text-left'>
                <SubHeading>NECA ICT Academy Application Portal</SubHeading>
                <h2 className='text-2xl font-semibold text-[#27156F] mb-4 mt-6'>
                  Register Now!
                </h2>
                <p className='text-gray-600 text-xl mb-7'>
                  To apply for our training programs or opportunities, please
                  fill out the form below with accurate information. Ensure all
                  required fields are completed to avoid delays in processing{" "}
                  <br /> your application.
                </p>

                <form
                  onSubmit={handleSubmit((data: FormData) =>
                    submitMutation.mutate(data)
                  )}
                  className='space-y-6'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='md:col-span-2'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                            First Name
                          </label>
                          <input
                            type='text'
                            placeholder='First Name'
                            {...register("firstName", { required: true })}
                            className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer'
                            disabled={submitMutation.status === "pending"}
                          />
                          {errors.firstName && (
                            <span className='text-red-500 text-xs'>
                              First name is required
                            </span>
                          )}
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                            Last Name
                          </label>
                          <input
                            type='text'
                            placeholder='Last Name'
                            {...register("lastName", { required: true })}
                            className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer'
                            disabled={submitMutation.status === "pending"}
                          />
                          {errors.lastName && (
                            <span className='text-red-500 text-xs'>
                              Last name is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                        Email Address
                      </label>
                      <input
                        type='email'
                        {...register("email", { required: true })}
                        disabled={submitMutation.status === "pending"}
                        className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer'
                        placeholder='Enter your email address'
                      />
                      {errors.email && (
                        <span className='text-red-500 text-xs'>
                          Email is required
                        </span>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        {...register("phoneNumber", { required: true })}
                        disabled={submitMutation.status === "pending"}
                        className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] cursor-pointer'
                        placeholder='Enter your phone number'
                      />
                      {errors.phoneNumber && (
                        <span className='text-red-500 text-xs'>
                          Phone number is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                        State
                      </label>
                      <div className='relative'>
                        <select
                          {...register("state", { required: true })}
                          disabled={submitMutation.status === "pending"}
                          className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none'
                        >
                          <option value=''>Select your state</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <MdArrowDropDown
                          size={24}
                          className='absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none'
                        />
                      </div>
                      {errors.state && (
                        <span className='text-red-500 text-xs'>
                          State is required
                        </span>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                        Gender
                      </label>
                      <div className='relative'>
                        <select
                          {...register("gender", { required: true })}
                          disabled={submitMutation.status === "pending"}
                          className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none capitalize'
                        >
                          <option value=''>Select gender</option>
                          {genderOptions.map((gender) => (
                            <option key={gender} value={gender}>
                              {gender}
                            </option>
                          ))}
                        </select>
                        <MdArrowDropDown
                          size={24}
                          className='absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none'
                        />
                      </div>
                      {errors.gender && (
                        <span className='text-red-500 text-xs'>
                          Gender is required
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                      Cohorts
                    </label>
                    <div className='relative'>
                      <select
                        {...register("cohort", { required: true })}
                        disabled={submitMutation.status === "pending"}
                        className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none'
                      >
                        <option value=''>
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
                        className='absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none'
                      />
                    </div>
                    {errors.cohort && (
                      <span className='text-red-500 text-xs'>
                        Cohort is required
                      </span>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 text-left mb-2'>
                      Course
                    </label>
                    <div className='relative'>
                      <select
                        {...register("course", { required: true })}
                        disabled={submitMutation.status === "pending"}
                        className='w-full p-3 border border-[#1E1E1E] rounded-md focus:outline-none focus:ring focus:ring-[#1E1E1E] appearance-none'
                      >
                        <option value=''>
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
                        className='absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none'
                      />
                    </div>
                    {errors.course && (
                      <span className='text-red-500 text-xs'>
                        Course is required
                      </span>
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Controller
                      name='cv'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }: any) => (
                        <FileUploader
                          label='Upload CV'
                          name='cv'
                          required
                          accept='.pdf,.doc,.docx'
                          icon={<MdDescription />}
                          placeholder='Upload your CV'
                          onFileChange={field.onChange}
                          currentFile={field.value}
                        />
                      )}
                    />
                    <Controller
                      name='profileImage'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }: any) => (
                        <FileUploader
                          label='Upload Profile Image'
                          name='profileImage'
                          required
                          accept='image/*'
                          icon={<MdImage />}
                          placeholder='Upload your image'
                          onFileChange={field.onChange}
                          currentFile={field.value}
                        />
                      )}
                    />
                  </div>
                  <button
                    type='submit'
                    disabled={submitMutation.status === "pending"}
                    className={`w-full bg-[#E02B20] text-white py-3 px-5 rounded-md hover:bg-[#E02B20]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E02B20] focus:ring-opacity-50 cursor-pointer ${
                      submitMutation.status === "pending" ? "opacity-75" : ""
                    }`}
                  >
                    {submitMutation.status === "pending"
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center min-h-[70vh] px-4 text-center'>
            <div className='w-24 h-24 mb-6 text-gray-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-semibold text-gray-800 mb-3'>
              No Active Cohorts at the Moment
            </h1>
            <p className='text-gray-600 max-w-md mb-6'>
              We're currently preparing for our next cohort. Stay tuned for
              exciting learning opportunities coming soon!
            </p>
            <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-md'>
              <h2 className='text-blue-800 font-medium mb-2'>What to Expect</h2>
              <ul className='text-blue-700 text-sm space-y-2'>
                <li className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Hands-on training with industry experts
                </li>
                <li className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Real-world project experience
                </li>
                <li className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Career support and mentorship
                </li>
              </ul>
            </div>
          </div>
        )}
        {showModal &&
          (!showReview ? (
            <CheckStatusModal
              email={email}
              setEmail={setEmail}
              onCheckStatus={handleCheckStatus}
              emailError={emailError}
              onClose={toggleModal}
              isPending={checkStatusMutation.status === "pending"}
            />
          ) : (
            <ApplicationReview
              applicantStatus={applicantStatus}
              statusError={statusError}
              onClose={handleCloseReview}
            />
          ))}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
        />
      </div>
    </div>
  );
};

export default ApplicationPortal;
