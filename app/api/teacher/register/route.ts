import { Teacher } from "@/models/teachers.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import generator from "generate-password";
import { connectToDatabase } from "@/utils/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, subjects, course, classes } = await request.json();

    if (!name || !email) {
        return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    var password = generator.generate({
        length: 10,
        numbers: true
    });

    try {
        await connectToDatabase();

        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
            return NextResponse.json({ message: "Teacher with this email already exists" }, { status: 400 });
        }

        const newTeacher = Teacher.create({
            name,
            email,
            password,
            subjects,
            course,
            classes
        })

        if (!newTeacher) {
            return NextResponse.json({ message: "Failed to create teacher" }, { status: 500 });
        }

        return NextResponse.json({ message: "Teacher registered successfully", teacher: newTeacher }, { status: 201 });
    } catch (error) {
        console.error("Error registering teacher:", error);
        return NextResponse.json({ message: "Internal Server Error during adding teacher" }, { status: 500 });
    }

};