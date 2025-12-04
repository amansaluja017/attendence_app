import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "./db";
import { Admin } from "@/models/admin.model";
import bcrypt from "bcrypt";
import { Teacher } from "@/models/teachers.model";
import { Student } from "@/models/students.model";
import { useSession } from "next-auth/react";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("All feilds are required!")
                }

                const session = useSession();
                console.log("Session in auth.ts", session);
                if (session.data) {
                    alert("Already logged in")
                    throw new Error("Already logged in")
                }

                try {
                    await connectToDatabase();

                    const admin = await Admin.findOne({ email: credentials.email });
                    if (!admin) {
                        console.log("No admin found with this email");
                    }

                    const teacher = await Teacher.findOne({ email: credentials.email });
                    const student = await Student.findOne({ email: credentials.email });

                    const user = admin || teacher || student;

                    if (!user) {
                        throw new Error("no user found")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    if (!isValid) {
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    }

                } catch (error) {
                    console.error("Auth error", error)
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
        async session({ token, session }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET
};