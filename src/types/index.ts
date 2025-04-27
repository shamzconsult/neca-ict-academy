type Status = 'Admitted' | 'Pending' | 'Declined' | 'Graduated';

export type CourseOutline = {
  header: string;
  lists: string[];
};

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

export type DashboardStats =
  | {
      name: string;
      value: number;
    }[]
  | undefined;

export type Courses = {
  id: string;
  slug?: string;
  coverImage: string;
  title: string;
  description: string;
  rating?: string;
  review?: string;
  lesson?: string;
  duration?: string;
  skillLevel?: string;
  mode?: string;
  category?: string;
};

export type CourseType = {
  courseOutlines: CourseOutline[];
  duration: string;
  skillLevel: string;
  rating: string;
  review: string;
  mode: string;
  lesson: string;
  description: string;
  slug: string;
  title: string;
  coverImage: string;
  courses: Courses[];
};
