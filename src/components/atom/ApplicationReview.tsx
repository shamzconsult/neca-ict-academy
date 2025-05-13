import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ApplicationReviewProps {
  onClose: () => void;
  applicantStatus: {
    status: "pending" | "admitted" | "declined" | "interview";
    applicant: { firstName: string; lastName: string };
  } | null;
  statusError: string;
}

export const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  onClose,
  applicantStatus,
  statusError,
}) => {
  return (
    <Dialog open={!!applicantStatus || !!statusError} onOpenChange={onClose}>
      <DialogContent>
        {statusError ? (
          <DialogHeader>
            <DialogTitle className='text-red-600 text-center pt-3 text-xl font-bold mb-6'>
              {statusError}
            </DialogTitle>
          </DialogHeader>
        ) : applicantStatus ? (
          <>
            {applicantStatus.status === "pending" && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-[#27156F] text-center font-bold mb-6'>
                    Your Application is Under Review
                  </DialogTitle>
                </DialogHeader>
                <p className='text-sm text-center'>
                  Dear {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, your application is
                  currently under review. We'll notify you once a decision has
                  been made.
                </p>
              </>
            )}
            {applicantStatus.status === "interview" && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-[#27156F] text-center font-bold mb-6'>
                    You&apos;re scheduled for an Interview
                  </DialogTitle>
                </DialogHeader>
                <p className='text-sm text-center'>
                  Dear {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, you&apos;ve been
                  scheduled for an interview, check your email box for more
                  details.
                </p>
              </>
            )}
            {applicantStatus.status === "admitted" && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-green-600 text-center font-bold mb-6'>
                    🎉 Application Accepted
                  </DialogTitle>
                </DialogHeader>
                <p className='text-sm text-center'>
                  Congratulations {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}! You have admitted to the
                  course.
                </p>
              </>
            )}
            {applicantStatus.status === "declined" && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-red-600 text-center font-bold mb-6'>
                    Application Not Successful
                  </DialogTitle>
                </DialogHeader>
                <p className='text-sm text-center'>
                  Hi {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, thank you for your
                  interest in our program. While we are unable to offer you a
                  spot this time, we encourage you to apply again in the future.
                  We appreciate your effort and wish you the best in your
                  learning journey!
                </p>
              </>
            )}
          </>
        ) : (
          <p className='text-center'>Loading status...</p>
        )}
        <DialogFooter className='flex justify-center'>
          <DialogClose asChild>
            <button className='px-10 py-1.5 bg-[#E02B20] text-white rounded-md cursor-pointer mt-6'>
              Okay
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
