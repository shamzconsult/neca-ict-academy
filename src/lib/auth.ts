import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectViaMongoose from "./db";
import User from "@/models/user";
import type { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectViaMongoose();
        
        
        try {
            const email = credentials.email.trim().toLowerCase();
            const password = credentials.password.trim();
                        
            const user = await User.findOne({ email });
            if (!user) 
              return null;
            
           
            const isValid = await bcrypt.compare(password, user.password);
          
            if (!isValid) 
                return null;
              
          
              if (!["Admin", "Super_Admin"].includes(user.role)) 
                return null;
              
          
          return {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            sessionVersion: user.sessionVersion || 0
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    forgotPassword: '/forgot-password'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};

export default NextAuth(authOptions);