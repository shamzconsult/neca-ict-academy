import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

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
            <DialogTitle className='text-red-600 text-center pt-3 text-xl font-bold'>
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
                    <DialogTitle className='text-[#27156F] text-center font-bold'>
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
                    <DialogTitle className='text-[#27156F] text-center font-bold'>
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
                    <DialogTitle className='text-green-600 text-center font-bold'>
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
                    <DialogTitle className='text-red-600 text-center font-bold'>
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
                    <DialogTitle className='text-gray-600 text-center font-bold'>
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
        <DialogFooter>
          <DialogClose asChild>
            <div className='w-full flex justify-center align-center'>
              <Button variant='outline'>Okay</Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
