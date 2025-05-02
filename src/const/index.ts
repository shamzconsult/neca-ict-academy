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
