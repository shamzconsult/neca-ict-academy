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
