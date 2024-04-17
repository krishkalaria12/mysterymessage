import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "john.doe@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {password: credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please Verify your account first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect password")
                    }else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async session({session, token}){
            if (token) {
                session.user._id = token._id?.toString(),
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session
        },
        async jwt({token, user}) {
            if (user) {
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }

            return token
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

