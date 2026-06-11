import {
  ApplicationLevel,
  ApplicationStatus,
  EmploymentStatusKey,
  Gender,
} from "@/const";

type Status = "Admitted" | "Pending" | "Declined" | "Graduated";

export type CourseOutline = {
  header: string;
  lists: string[];
};

export type HonorSummary = {
  _id: string;
  titleId: string;
  name: string;
  slug: string;
  scope: "course" | "cohort";
  badgeColor: string;
  notes?: string;
  awardedAt: string;
};

export type GraduationTitleType = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  scope: "course" | "cohort";
  maxWinners: number;
  badgeColor: string;
  active: boolean;
  sortOrder: number;
};

export type AnnouncementType = {
  _id: string;
  title: string;
  url: string;
  active: boolean;
  hidden: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type EnrollmentType = {
  _id: string;
  enrollmentId?: string;
  course: string;
  surname: string;
  otherNames: string;
  applicant: ApplicantDetail;
  cohort: CohortType;
  level: ApplicationLevel;
  email: string;
  status: ApplicationStatus;
  createdAt: string;
  phoneNumber: string;
  gender: Gender;
  state: string;
  profilePicture: {
    url: string;
    public_id: string;
  };
  cv: {
    url: string;
    public_id: string;
  };
  employmentStatus: EmploymentStatusKey;
  honors?: HonorSummary[];
};

export type EnrollmentsType = EnrollmentType[];

export type ApplicantDetail = {
  _id: string;
  surname: string;
  otherNames: string;
  email: string;
  course: string;
  level: string;
  state: string;
  status: Status;
  createdAt: string;
  phoneNumber: string;
  gender: Gender;
  profilePicture: {
    url: string;
    public_id: string;
  };
};

export type CohortType = {
  applicationStartDate: string;
  applicationEndDate: string;
  createdAt: string | number | Date;
  _id: number;
  slug: string;
  name: string;
  active: boolean;
  admitted: number;
  graduated: number;
  declined: number;
  applicantCount: number;
  startDate: string;
  endDate: string;
  courses: string[];
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
  _id: string;
  courseOutlines: CourseOutline[];
  duration: string;
  skillLevel: string;
  rating: string;
  review: string;
  lesson: string;
  description: string;
  slug: string;
  title: string;
  coverImage: string;
  hasCertificate: boolean;
  type: "Physical" | "Virtual" | "Hybrid";
  totalEnrolled?: number;
  acceptingApplications?: boolean;
};
