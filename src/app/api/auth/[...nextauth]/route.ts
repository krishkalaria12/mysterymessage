import nextAuth from "next-auth";
import { AuthOptions } from "./options"
import NextAuth from "next-auth/next";

const handler = NextAuth(AuthOptions)

export {handler as GET, handler as POST}