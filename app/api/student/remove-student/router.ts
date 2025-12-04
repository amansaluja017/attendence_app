import { Student } from "@/models/students.model";
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

        const deletedStudent = await Student.findOneAndDelete({ email });

        if (!deletedStudent) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Student deleted successfully", student: deletedStudent }, { status: 200 });
    } catch (error) {
        console.log("Error deleting student:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}