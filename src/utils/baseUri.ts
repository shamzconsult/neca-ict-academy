export const baseURL =
  process.env.NEXT_PUBLIC_CWUBB_ENV === "production"
    ? "https://necaictacademy.com"
    : "http://localhost:3000";
