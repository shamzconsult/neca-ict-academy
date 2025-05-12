import React from "react";

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <p>stat</p>
      {statusError}
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        {statusError ? (
          <>
            <p className="text-red-600 text-center pt-3 text-xl font-bold mb-6">
              {statusError}
            </p>
          </>
        ) : applicantStatus ? (
          <>
            {applicantStatus.status === "pending" && (
              <>
                <p className="text-[#27156F] text-center font-bold mb-6">
                  Your Application is Under Review
                </p>
                <p className="text-sm text-center">
                  Dear {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, your application is
                  currently under review. We’ll notify you once a decision has
                  been made.
                </p>
              </>
            )}
            {applicantStatus.status === "interview" && (
              <>
                <p className="text-[#27156F] text-center font-bold mb-6">
                  You&apos;re scheduled for an Interview
                </p>
                <p className="text-sm text-center">
                  Dear {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, you&apos;ve been
                  scheduled for an interview, check your email box for more
                  details.
                </p>
              </>
            )}
            {applicantStatus.status === "admitted" && (
              <>
                <p className="text-green-600 text-center font-bold mb-6">
                  🎉 Application Accepted
                </p>
                <p className="text-sm text-center">
                  Congratulations {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}! You have admitted to the
                  course.
                </p>
              </>
            )}
            {applicantStatus.status === "declined" && (
              <>
                <p className="text-red-600 text-center font-bold mb-6">
                  Application Rejected
                </p>
                <p className="text-sm text-center">
                  Hi {applicantStatus.applicant.firstName}{" "}
                  {applicantStatus.applicant.lastName}, we regret to inform you
                  that your application has not been successful.
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-center">Loading status...</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-1.5 bg-[#E02B20] text-white rounded-md cursor-pointer mt-6"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
