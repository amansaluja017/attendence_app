import { Course } from "@/models/courses.model";
import { adminAuthOptions } from "@/utils/admin.auth";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await getServerSession(adminAuthOptions);

    if (!session) {
        return NextResponse.json(
            { message: "You are not authenticated" },
            { status: 401 }
        )
    }

    const {name, subjects}: {name: string, subjects: Array<string>} = await request.json();

    if (!name || !(subjects && subjects.length > 0)) {
        return NextResponse.json({ message: "Name and subjects are required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const newCourse = Course.create({
            name,
            subjects
        });
        return NextResponse.json({ message: "Course created successfully", newCourse }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}