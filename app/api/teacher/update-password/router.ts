import { Teacher } from "@/models/teachers.model";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
        return NextResponse.json({ message: "Email and new password are required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const teacher = await Teacher.findOne({email});

        if (!teacher) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        teacher.password = newPassword;
        await teacher.save();

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error updating password:", error);
        return NextResponse.json({ message: "Internal Server Error during password update" }, { status: 500 });
    }
}