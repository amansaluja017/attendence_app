import { Student } from "@/models/students.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
        return NextResponse.json({ message: "Email and New Password are required" }, { status: 400 });
    }

    try {
        const student = await Student
            .findOne({ email });
        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        student.password = newPassword;
        await student.save();
        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {

        console.log("Error updating password:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}