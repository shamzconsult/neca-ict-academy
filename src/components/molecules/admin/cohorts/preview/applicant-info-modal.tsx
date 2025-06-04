import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnrollmentType } from "@/types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  enrollment: EnrollmentType;
};

export const ApplicantInfoModal = ({
  isOpen,
  onOpenChange,
  enrollment,
}: Props) => {
  const {
    profilePicture,
    phoneNumber,
    surname,
    otherNames,
    email,
    state,
    gender,
    course,
    level,
    status,
    cv,
    createdAt,
    employmentStatus,
  } = enrollment;

  const isValidPdf = cv?.url?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("!max-w-6xl h-[80vh]")}>
        <div className='flex flex-col gap-4'>
          <DialogHeader>
            <DialogTitle>Applicant Information</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col md:flex-row gap-6 items-start'>
            <div className='flex flex-col items-center md:items-start gap-4 w-'>
              {profilePicture?.url && (
                <img
                  src={profilePicture.url.replace(/[`'"]/g, "").trim()}
                  alt={`${surname} ${otherNames}`}
                  className='w-24 h-24 rounded-full object-cover border'
                />
              )}
              <div className='w-full'>
                <div className='mb-2 break-all block w-[300px]'>
                  <strong>Name:</strong> {surname} {otherNames}
                </div>
                <div className='mb-2 break-all block w-[300px]'>
                  <strong>Email:</strong> {email}
                </div>
                <div className='mb-2'>
                  <strong>Phone:</strong> {phoneNumber}
                </div>
                <div className='mb-2'>
                  <strong>State:</strong> {state}
                </div>
                <div className='mb-2'>
                  <strong>Gender:</strong> {gender}
                </div>
                <div className='mb-2'>
                  <strong>Course:</strong> {String(course)}
                </div>
                <div className='mb-2'>
                  <strong>Level:</strong> {level}
                </div>
                <div className='mb-2'>
                  <strong>Status:</strong> {status}
                </div>
                <div className='mb-2'>
                  <strong>Employment Status:</strong>{" "}
                  {employmentStatus || "N/A"}
                </div>
                <div className='mb-2'>
                  <strong>Date Applied:</strong>{" "}
                  {new Date(createdAt).toLocaleString()}
                </div>
                {cv?.url && (
                  <div className='mb-2'>
                    <strong>CV:</strong>{" "}
                    {isValidPdf ? (
                      <a
                        href={cv.url.replace(/[`'"]/g, "").trim()}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        Download CV
                      </a>
                    ) : (
                      <span className='text-red-500'>Invalid CV format</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {cv?.url && (
              <div
                className='hidden lg:flex flex-1 w-full mt-4 md:mt-0'
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {isValidPdf ? (
                  <div className='w-full relative flex justify-center items-center'>
                    {/* loading state */}
                    <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      <p className='sr-only'>Loading CV...</p>
                    </div>
                    <iframe
                      src={`${cv.url.replace(/[`'\"]/g, "").trim()}#toolbar=0&navpanes=0`}
                      title='Applicant CV'
                      width='100%'
                      height='700px'
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        minHeight: "400px",
                        maxHeight: "70vh",
                        zIndex: 10,
                      }}
                    />
                  </div>
                ) : (
                  <div className='w-full h-[600px] flex items-center justify-center border border-red-200 bg-red-50 rounded-lg'>
                    <div className='text-center'>
                      <p className='text-red-600 font-medium'>
                        Invalid CV Format
                      </p>
                      <p className='text-red-500 text-sm mt-1'>
                        Applicant CV is an invalid PDF file
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <div>
            <button
              className="mt-4 bg-black text-white py-2 px-4 rounded-lg cursor-pointer"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
