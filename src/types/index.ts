type Status = "Admitted" | "Pending" | "Declined" | "Graduated";

export type ApplicantDetail = {
  applicantName: string;
  applicantEmail: string;
  course: string;
  level: number;
  location: string;
  date: string;
  status: Status;
};

export type CohortType = {
  _id: number;
  slug: string;
  name: string;
  applicants: string;
  admitted: string;
  graduated: string;
  declined: string;
  startDate: string;
  endDate: string;
  applicantDetails: ApplicantDetail[];
};

export type CohortsProps = {
  cohortsData: CohortType[];
};
