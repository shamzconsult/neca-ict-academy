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
          (() => {
            const applicant = applicantStatus.applicant || {};
            const statusContent: Record<string, React.ReactNode> = {
              pending: (
                <>
                  <DialogHeader>
                    <DialogTitle className='text-[#27156F] text-center font-bold mb-6'>
                      Your Application is Under Review
                    </DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-center'>
                    Dear{" "}
                    <span className='font-semibold'>
                      {applicant.firstName} {applicant.lastName}
                    </span>
                    , your application is currently under review. We'll notify
                    you once a decision has been made.
                  </p>
                </>
              ),
              interview: (
                <>
                  <DialogHeader>
                    <DialogTitle className='text-[#27156F] text-center font-bold mb-6'>
                      You&apos;re scheduled for an Interview
                    </DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-center'>
                    Dear{" "}
                    <span className='font-semibold'>
                      {applicant.firstName} {applicant.lastName}
                    </span>
                    , you&apos;ve been scheduled for an interview, check your
                    email box for more details.
                  </p>
                </>
              ),
              admitted: (
                <>
                  <DialogHeader>
                    <DialogTitle className='text-green-600 text-center font-bold mb-6'>
                      🎉 Application Accepted
                    </DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-center'>
                    Congratulations{" "}
                    <span className='font-semibold'>
                      {applicant.firstName} {applicant.lastName}
                    </span>
                    ! You have been admitted to the cohort. Check your email for
                    further details.
                  </p>
                </>
              ),
              declined: (
                <>
                  <DialogHeader>
                    <DialogTitle className='text-red-600 text-center font-bold mb-6'>
                      Application Not Successful
                    </DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-center'>
                    Hi{" "}
                    <span className='font-semibold'>
                      {applicant.firstName} {applicant.lastName}
                    </span>
                    , thank you for your interest in our program. While we are
                    unable to offer you a spot this time, we encourage you to
                    apply again in the future. We appreciate your effort and
                    wish you the best in your learning journey!
                  </p>
                </>
              ),
            };
            return (
              statusContent[applicantStatus.status] || (
                <>
                  <DialogHeader>
                    <DialogTitle className='text-gray-600 text-center font-bold mb-6'>
                      Unknown Application Status
                    </DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-center'>
                    Hi {applicant.firstName || "Applicant"}{" "}
                    {applicant.lastName || ""}, we couldn't determine your
                    application status. Please contact support for more
                    information.
                  </p>
                </>
              )
            );
          })()
        ) : null}
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
