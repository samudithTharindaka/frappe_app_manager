import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "Admin" | "Dev" | "Viewer";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "Admin" | "Dev" | "Viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "Admin" | "Dev" | "Viewer";
  }
}

