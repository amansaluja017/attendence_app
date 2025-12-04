import { Teacher } from "@/models/teachers.model";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const teacher = await Teacher.findOneAndDelete({ email });

        if (!teacher) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Teacher removed successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error removing teacher:", error);
        return NextResponse.json({ message: "Internal Server Error during removing teacher" }, { status: 500 });
    }
}