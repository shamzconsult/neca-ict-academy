import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    surname?: string;
    otherNames?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth" {
  interface PagesOptions {
    forgotPassword?: string;
  }
}
