"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { SubHeading } from "@/components/atom/headers/SubHeading";
import Link from "next/link";
import { CheckStatusModal } from "./CheckStatusModal";
import { ApplicationReview } from "./ApplicationReview";
import SuccessModal from "./SuccessPage";
import { FileUploader } from "@/components/atom/FileUploader";
import { FieldError } from "@/components/atom/form/FormFeedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  MailSearch,
  Phone,
} from "lucide-react";
import { CohortGallery } from "./CohortGallery";
import {
  genderOptions,
  levelOptionsMap,
  states,
  statusOptionsMap,
  employmentStatusOptions,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/const";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  surname: string;
  otherNames: string;
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
  employmentStatus: string;
}

type ApplicationFormProps = Array<{
  _id: string;
  name: string;
  courses?: Array<{ _id: string; title: string }>;
}>;

const selectTriggerClassName =
  "h-11 w-full border-[#27156F]/15 bg-white text-[#27156F] shadow-xs focus-visible:border-[#27156F]/40 focus-visible:ring-[#27156F]/20 disabled:opacity-50";

const inputClassName =
  "h-11 border-[#27156F]/15 bg-white text-[#27156F] placeholder:text-gray-400 focus-visible:border-[#27156F]/40 focus-visible:ring-[#27156F]/20";

function FormSelect({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  options,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <Select
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={selectTriggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className='rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-5 sm:p-6'>
      <div className='mb-5 border-b border-[#27156F]/10 pb-4 text-left'>
        <h3 className='text-base font-bold text-[#27156F] sm:text-lg'>
          {title}
        </h3>
        {description && (
          <p className='mt-1 text-sm text-gray-600'>{description}</p>
        )}
      </div>
      <div className='space-y-5'>{children}</div>
    </section>
  );
}

function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5 text-left", className)}>
      <Label htmlFor={htmlFor} className='text-[#27156F]'>
        {label}
        {required && <span className='text-[#E02B20]'> *</span>}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const TIMELINE_STEPS = [
  {
    step: 1,
    label: "Application",
    description: "Submit your form and documents",
  },
  {
    step: 2,
    label: "Interview",
    description: "Shortlisted candidates are invited",
  },
  {
    step: 3,
    label: "Selection",
    description: "Final cohort placement confirmed",
  },
] as const;

function ApplicationTimeline({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) {
  const activeStep = 1;

  if (variant === "horizontal") {
    return (
      <div className='rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-4 sm:p-5'>
        <p className='mb-5 text-sm font-semibold text-[#27156F]'>
          Application timeline
        </p>
        <div className='relative flex items-start justify-between'>
          <span
            className='absolute left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] top-4 h-0.5 bg-[#27156F]/10'
            aria-hidden
          />
          {TIMELINE_STEPS.map((item) => {
            const isActive = item.step === activeStep;
            const isComplete = item.step < activeStep;

            return (
              <div
                key={item.step}
                className='relative z-10 flex w-1/3 flex-col items-center text-center'
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                    isActive &&
                      "bg-[#27156F] text-white shadow-sm ring-4 ring-[#27156F]/15",
                    isComplete && "bg-[#27156F] text-white",
                    !isActive &&
                      !isComplete &&
                      "border-2 border-[#27156F]/15 bg-white text-[#27156F]/40",
                  )}
                >
                  {item.step}
                </span>
                <p
                  className={cn(
                    "mt-2 text-xs font-semibold sm:text-sm",
                    isActive ? "text-[#27156F]" : "text-gray-500",
                  )}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-5 sm:p-6'>
      <h2 className='text-lg font-bold text-[#27156F]'>Application timeline</h2>
      <p className='mt-1 text-sm text-gray-600'>
        Three steps from application to final selection.
      </p>
      <ol className='mt-5 space-y-0'>
        {TIMELINE_STEPS.map((item, index) => {
          const isActive = item.step === activeStep;
          const isComplete = item.step < activeStep;
          const isLast = index === TIMELINE_STEPS.length - 1;

          return (
            <li key={item.step} className='flex gap-4'>
              <div className='flex flex-col items-center'>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    isActive &&
                      "bg-[#27156F] text-white shadow-sm ring-4 ring-[#27156F]/15",
                    isComplete && "bg-[#27156F] text-white",
                    !isActive &&
                      !isComplete &&
                      "border-2 border-[#27156F]/15 bg-white text-[#27156F]/40",
                  )}
                >
                  {item.step}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 w-0.5 min-h-8 flex-1 rounded-full",
                      isComplete || isActive
                        ? "bg-gradient-to-b from-[#27156F]/40 to-[#27156F]/10"
                        : "bg-[#27156F]/10",
                    )}
                    aria-hidden
                  />
                )}
              </div>
              <div className={cn("pb-5", isLast && "pb-0")}>
                <p
                  className={cn(
                    "font-semibold",
                    isActive ? "text-[#27156F]" : "text-gray-600",
                  )}
                >
                  {item.label}
                </p>
                <p className='mt-0.5 text-sm text-gray-500'>
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EnquiryContact() {
  return (
    <section className='rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-5 text-left sm:p-6'>
      <h2 className='text-lg font-bold text-[#27156F]'>Need help?</h2>
      <p className='mt-1 text-sm text-gray-600'>
        For enquiries about your application, get in touch with us.
      </p>
      <div className='mt-4 space-y-3'>
        <a
          href='mailto:contact@necaictacademy.org'
          className='flex items-center [word-break:break-all] gap-2.5 text-sm text-[#27156F] transition-colors hover:text-[#27156F]/80 hover:underline'
        >
          <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
            <Mail className='size-4' />
          </span>
          contact@necaictacademy.org
        </a>
        <a
          href='tel:+2348099387853'
          className='flex items-center gap-2.5 text-sm text-[#27156F] transition-colors hover:text-[#27156F]/80 hover:underline'
        >
          <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
            <Phone className='size-4' />
          </span>
          +234 809 938 7853
        </a>
      </div>
    </section>
  );
}

function PortalInfoColumn({ variant }: { variant: "sidebar" | "mobile" }) {
  return (
    <div className='min-w-0 space-y-6'>
      <CohortGallery variant={variant === "sidebar" ? "sidebar" : "compact"} />
      <ApplicationTimeline
        variant={variant === "sidebar" ? "vertical" : "horizontal"}
      />
      <EnquiryContact />
    </div>
  );
}

const ApplicationPortal = ({ cohorts }: { cohorts: ApplicationFormProps }) => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      surname: "",
      otherNames: "",
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
      employmentStatus: "",
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
  const selectedCohort = watch("cohort");
  const [cohortCourses, setCohortCourses] = useState<
    { _id: string; title: string }[]
  >([]);

  // Fetch courses for selected cohort
  useEffect(() => {
    if (!selectedCohort) {
      setCohortCourses([]);
      return;
    }
    const foundCohort = cohorts.find((c) => c._id === selectedCohort);
    if (foundCohort && Array.isArray(foundCohort.courses)) {
      setCohortCourses(foundCohort.courses);
    } else {
      setCohortCourses([]);
    }
  }, [selectedCohort, cohorts]);

  // React Query: Application submission
  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "cv" || key === "profileImage") {
          if (value)
            formDataToSend.append(
              key === "profileImage" ? "profilePicture" : key,
              value as File,
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
      // setEmail("");
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
    <div className='relative min-h-screen bg-white'>
      {/* Background Elements */}
      <div className='pointer-events-none fixed top-0 left-0 z-0 h-[73%] w-[8%] origin-top-left rotate-[-0.47deg] transform'>
        <Image
          src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1742225179/Rectangle_4384_onnutg.png'
          alt='Background Left'
          layout='fill'
          objectFit='cover'
          className='opacity-40'
          priority
        />
      </div>
      <div className='pointer-events-none absolute bottom-0 right-0 z-[5] hidden h-[366px] w-[366px] lg:block'>
        <img
          src='https://cdn.hashnode.com/res/hashnode/image/upload/v1747112476016/86e16667-5b96-461a-845f-0f6e896b0fb5.png'
          alt='Background Right'
          className='opacity-[20%]'
        />
      </div>

      {/* Fixed Header */}
      <header className='fixed top-0 left-0 right-0 z-30 border-b border-[#27156F]/10 bg-white/95 backdrop-blur-sm'>
        <div className='px-5 lg:px-[8%] py-3 sm:py-4'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <Link href='/' className='relative w-36 shrink-0 lg:w-44'>
              <Image
                src='https://res.cloudinary.com/daqmbfctv/image/upload/e_improve/v1742551380/WhatsApp_Image_2025-03-20_at_22.40.25_5d4664d3_ly2n2x.png'
                alt='NECA ICT ACADEMY Logo'
                width={144}
                height={72}
                className='h-full w-full cursor-pointer object-contain'
              />
            </Link>
            <div className='flex w-full items-center justify-center gap-3 rounded-xl border border-[#27156F]/10 bg-[#DBEAF6]/30 px-3 py-2 sm:w-auto sm:justify-end sm:px-4 sm:py-2.5'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
                <MailSearch className='size-4 text-[#27156F]' />
              </div>
              <p className='text-sm text-gray-600 hidden min-[450px]:block'>
                Already applied?
              </p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='shrink-0 border-[#27156F]/20 bg-white text-[#27156F] hover:bg-[#27156F]/5'
                onClick={toggleModal}
              >
                <span className='sm:hidden'>Check application status</span>
                <span className='hidden sm:block'>Check status</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {cohorts?.length > 0 ? (
        <main className='px-5 lg:pl-[8.5%] lg:pr-[8%] relative z-10 grid min-w-0 pt-24 lg:grid-cols-2 lg:items-start gap-10 xl:gap-20'>
          {/* Left column — desktop only */}
          <aside className='hidden min-w-0 lg:block lg:py-8'>
            <PortalInfoColumn variant='sidebar' />
          </aside>

          <section className='min-w-0 py-6 pb-8 pt-20 sm:py-8 sm:pb-10'>
            <div className='text-center lg:text-left'>
              <SubHeading>NECA ICT Academy Application Portal</SubHeading>

              <h2 className='mb-2 mt-6 text-2xl font-bold text-[#27156F] sm:text-3xl'>
                Register Now
              </h2>
              <p className='mb-8 text-base leading-relaxed text-gray-600 sm:text-lg'>
                Fill in accurate, up-to-date details to complete your
                application.
              </p>

              <form
                onSubmit={handleSubmit((data: FormData) =>
                  submitMutation.mutate(data),
                )}
                className='space-y-6 text-left'
              >
                <FormSection
                  title='Personal information'
                  description='Tell us how to reach you.'
                >
                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <FormField
                      label='Surname'
                      htmlFor='surname'
                      required
                      error={errors.surname ? "Surname is required" : undefined}
                    >
                      <Input
                        id='surname'
                        type='text'
                        placeholder='Surname'
                        className={inputClassName}
                        disabled={submitMutation.isPending}
                        {...register("surname", { required: true })}
                      />
                    </FormField>
                    <FormField
                      label='Other names'
                      htmlFor='otherNames'
                      required
                      error={
                        errors.otherNames
                          ? "Other names are required"
                          : undefined
                      }
                    >
                      <Input
                        id='otherNames'
                        type='text'
                        placeholder='Other names'
                        className={inputClassName}
                        disabled={submitMutation.isPending}
                        {...register("otherNames", { required: true })}
                      />
                    </FormField>
                    <FormField
                      label='Email address'
                      htmlFor='email'
                      required
                      error={errors.email ? "Email is required" : undefined}
                    >
                      <Input
                        id='email'
                        type='email'
                        placeholder='you@example.com'
                        className={inputClassName}
                        disabled={submitMutation.isPending}
                        {...register("email", { required: true })}
                      />
                    </FormField>
                    <FormField
                      label='Phone number'
                      htmlFor='phoneNumber'
                      required
                      error={
                        errors.phoneNumber
                          ? "Phone number is required"
                          : undefined
                      }
                    >
                      <Input
                        id='phoneNumber'
                        type='tel'
                        placeholder='08012345678'
                        className={inputClassName}
                        disabled={submitMutation.isPending}
                        {...register("phoneNumber", { required: true })}
                      />
                    </FormField>
                    <FormField
                      label='State of residence'
                      htmlFor='state'
                      required
                      error={errors.state ? "State is required" : undefined}
                    >
                      <Controller
                        name='state'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormSelect
                            id='state'
                            value={field.value}
                            onChange={field.onChange}
                            placeholder='Select your state'
                            disabled={submitMutation.isPending}
                            options={states.map((state) => ({
                              value: state,
                              label: state,
                            }))}
                          />
                        )}
                      />
                    </FormField>
                    <FormField
                      label='Gender'
                      htmlFor='gender'
                      required
                      error={errors.gender ? "Gender is required" : undefined}
                    >
                      <Controller
                        name='gender'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <FormSelect
                            id='gender'
                            value={field.value}
                            onChange={field.onChange}
                            placeholder='Select gender'
                            disabled={submitMutation.isPending}
                            options={genderOptions.map((gender) => ({
                              value: gender,
                              label: gender,
                            }))}
                          />
                        )}
                      />
                    </FormField>
                  </div>
                </FormSection>

                <FormSection
                  title='Application details'
                  description='Choose your cohort and preferred course.'
                >
                  <FormField
                    label='Cohort'
                    htmlFor='cohort'
                    required
                    error={errors.cohort ? "Cohort is required" : undefined}
                  >
                    <Controller
                      name='cohort'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormSelect
                          id='cohort'
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("course", "");
                          }}
                          placeholder={
                            cohorts.length === 0
                              ? "No cohorts in session"
                              : "Select a cohort"
                          }
                          disabled={
                            submitMutation.isPending || cohorts.length === 0
                          }
                          options={cohorts.map((cohort) => ({
                            value: cohort._id,
                            label: cohort.name,
                          }))}
                        />
                      )}
                    />
                  </FormField>
                  <FormField
                    label='Course'
                    htmlFor='course'
                    required
                    error={errors.course ? "Course is required" : undefined}
                  >
                    <Controller
                      name='course'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormSelect
                          id='course'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={
                            !selectedCohort
                              ? "Select a cohort first"
                              : cohortCourses.length === 0
                                ? "No courses available"
                                : "Select a course"
                          }
                          disabled={
                            submitMutation.isPending ||
                            !selectedCohort ||
                            cohortCourses.length === 0
                          }
                          options={cohortCourses.map((course) => ({
                            value: course._id,
                            label: course.title,
                          }))}
                        />
                      )}
                    />
                  </FormField>
                  <FormField
                    label='Employment status'
                    htmlFor='employmentStatus'
                    required
                    error={
                      errors.employmentStatus
                        ? "Employment status is required"
                        : undefined
                    }
                  >
                    <Controller
                      name='employmentStatus'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormSelect
                          id='employmentStatus'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Select employment status'
                          disabled={submitMutation.isPending}
                          options={employmentStatusOptions.map((opt) => ({
                            value: opt.key,
                            label: opt.label,
                          }))}
                        />
                      )}
                    />
                  </FormField>
                </FormSection>

                <FormSection
                  title='Documents'
                  description='Upload a PDF CV and a clear profile photo (max 1MB each).'
                >
                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <Controller
                      name='cv'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <div className='space-y-1.5'>
                          <FileUploader
                            label='CV (PDF)'
                            name='cv'
                            required
                            accept='.pdf'
                            icon={<FileText className='size-5' />}
                            placeholder='Upload your CV'
                            onFileChange={field.onChange}
                            currentFile={field.value}
                            maxSize={MAX_UPLOAD_SIZE_BYTES}
                          />
                          <FieldError
                            message={errors.cv ? "CV is required" : undefined}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      name='profileImage'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <div className='space-y-1.5'>
                          <FileUploader
                            label='Profile photo'
                            name='profileImage'
                            required
                            accept='image/*'
                            icon={<ImageIcon className='size-5' />}
                            placeholder='Upload your photo'
                            onFileChange={field.onChange}
                            currentFile={field.value}
                            maxSize={MAX_UPLOAD_SIZE_BYTES}
                          />
                          <FieldError
                            message={
                              errors.profileImage
                                ? "Profile photo is required"
                                : undefined
                            }
                          />
                        </div>
                      )}
                    />
                  </div>
                </FormSection>

                <Button
                  type='submit'
                  disabled={submitMutation.isPending}
                  className='h-12 w-full gap-2 bg-[#27156F] text-base text-white hover:bg-[#27156F]/90'
                >
                  {submitMutation.isPending && (
                    <Loader2 className='size-4 animate-spin' />
                  )}
                  {submitMutation.isPending
                    ? "Submitting application..."
                    : "Submit application"}
                </Button>
              </form>
            </div>
          </section>

          {/* Left column — mobile only, below the form */}
          <aside className='min-w-0 pb-12 sm:px-8 sm:pb-16 lg:hidden'>
            <div className='mx-auto min-w-0 max-w-2xl'>
              <PortalInfoColumn variant='mobile' />
            </div>
          </aside>
        </main>
      ) : (
        <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 pt-44 text-center sm:pt-20'>
          <div className='mb-6 flex size-20 items-center justify-center rounded-full bg-[#DBEAF6]/50 text-[#27156F]/40'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-10'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
              />
            </svg>
          </div>
          <h1 className='mb-3 text-2xl font-bold text-[#27156F]'>
            No active cohorts right now
          </h1>
          <p className='mb-6 max-w-md text-gray-600'>
            We&apos;re preparing for the next intake. Check back soon for new
            learning opportunities.
          </p>
          <div className='max-w-md rounded-2xl border border-[#27156F]/10 bg-[#DBEAF6]/20 p-5 text-left'>
            <h2 className='mb-3 font-semibold text-[#27156F]'>
              What to expect
            </h2>
            <ul className='space-y-2.5 text-sm text-gray-700'>
              <li className='flex items-center gap-2'>
                <svg
                  className='size-4 shrink-0 text-[#27156F]'
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
                  className='size-4 shrink-0 text-[#27156F]'
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
                  className='size-4 shrink-0 text-[#27156F]'
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
  );
};

export default ApplicationPortal;
