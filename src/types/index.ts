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
  applicationStartDate: string;
  applicationEndDate: string;
  createdAt: string | number | Date;
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

export type Courses = {
  id: string;
  slug?: string;
  image: string;
  title: string;
  description: string;
  ratings?: string;
  reviews?: string;
  lessons?: string;
  duration?: string;
  skillLevel?: string;
  mode?: string;
  category?: string;
};

export type CourseType = {
  courses: Courses[];
};
