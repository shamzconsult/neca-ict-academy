import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnrollmentType } from "@/types";
import { cn } from "@/lib/utils";

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
    firstName,
    lastName,
    email,
    state,
    gender,
    course,
    level,
    status,
    cv,
    createdAt,
  } = enrollment;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(!!cv?.url && "!max-w-6xl h-[80vh]")}>
        <div className='flex flex-col gap-4'>
          <DialogHeader>
            <DialogTitle>Applicant Information</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col md:flex-row gap-6 items-start'>
            <div className='flex flex-col items-center md:items-start gap-4 w-'>
              {profilePicture?.url && (
                <img
                  src={profilePicture.url.replace(/[`'"]/g, "").trim()}
                  alt={`${firstName} ${lastName}`}
                  className='w-24 h-24 rounded-full object-cover border'
                />
              )}
              <div className='w-full'>
                <div className='mb-2 break-all block w-[300px]'>
                  <strong>Name:</strong> {firstName} {lastName}
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
                  <strong>Date Applied:</strong>{" "}
                  {new Date(createdAt).toLocaleString()}
                </div>
                {cv?.url && (
                  <div className='mb-2'>
                    <strong>CV:</strong>{" "}
                    <a
                      href={cv.url.replace(/[`'"]/g, "").trim()}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      Download CV
                    </a>
                  </div>
                )}
              </div>
            </div>
            {cv?.url && (
              <div className='hidden lg:flex flex-1 w-full mt-4 md:mt-0'>
                <iframe
                  src={`${cv.url.replace(/[`'"]/g, "").trim()}#toolbar=0&navpanes=0`}
                  title='Applicant CV'
                  width='100%'
                  height='700px'
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                />
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
