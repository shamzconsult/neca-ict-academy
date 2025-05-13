export const statusOptionsMap = {
  pending: "pending",
  interview: "interview",
  declined: "declined",
  admitted: "admitted",
  graduated: "graduated",
};

export const levelOptionsMap = {
  application: "application",
  interview: "interview",
  admission: "admission",
};

const genderOptionsMap = {
  male: "male",
  female: "female",
};

export const NECA_ICT_ACADEMY_LOGO =
  "https://res.cloudinary.com/dtryuudiy/image/upload/v1747163205/image-removebg-preview_ukiafb.png";

export const genderOptions = Object.keys(genderOptionsMap);
export const statusOptions = Object.keys(statusOptionsMap);
export const levelOptions = Object.keys(levelOptionsMap);

export type ApplicationStatus =
  (typeof statusOptionsMap)[keyof typeof statusOptionsMap];

export type ApplicationLevel =
  (typeof levelOptionsMap)[keyof typeof levelOptionsMap];

export type Gender = (typeof genderOptionsMap)[keyof typeof genderOptionsMap];

export const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT - Abuja",
];

export const cohortTableHead = [
  "Cohort Name",
  "Total Applicants",
  "Total Admitted",
  "Total Graduated",
  "Total Declined",
  "Start Date",
  "End Date",
  "Status",
  "Action",
];

export const applicantTableHead = [
  "Name",
  "Email",
  "Phone Number",
  "State",
  "Course",
  "Level",
  "Status",
];

export const adminCohortTableHead = [
  "Cohort Name",
  "Total Applicants",
  "Total Admitted",
  "Total Graduated",
  "Total Declined",
  "Start Date",
  "End Date",
];
