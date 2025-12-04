import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Class } from "@/models/class.model";

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            { message: "You are not authenticated" },
            { status: 401 }
        )
    }

    const {name, teacher, timing, course, subject, students}: {name: string, subject: string, teacher: string, timing: string, course: string, students: Array<string>} = await request.json();

    if (!name || !teacher || !timing || !course || !subject) {
        return NextResponse.json({ message: "Name, Teacher, Timing, Course and Subject are required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const newClass = Class.create({
            name,
            teacher,
            timing,
            course,
            subject,
            students
        });

        return NextResponse.json({ message: "Class created successfully", newClass }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error during creating classes" }, { status: 500 });
    }
}