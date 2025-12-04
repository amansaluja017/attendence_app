import { Student } from "@/models/students.model";
import { connectToDatabase } from "@/utils/db";
import { generate } from "generate-password";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {name, email, fatherName, phoneNumber, address, courses, classes} = await request.json();

    if (!name || !email) {
        return NextResponse.json({ message: "Name and Email are required" }, { status: 400 });
    }

    var password = generate({
        length: 10,
        numbers: true
    });

    try {
        await connectToDatabase();

        const existingStudent = await Student.findOne({email});

        if (existingStudent) {
            return NextResponse.json({ message: "Student with this email already exists" }, { status: 400 });
        }

        const newStudent = Student.create({
            name,
            email,
            fatherName,
            phoneNumber,
            address,
            courses,
            classes,
            password
        });

        return NextResponse.json({ message: "Student created successfully", student: newStudent, plainPassword: password }, { status: 201 });
    } catch (error) {
        console.log("Error creating student:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};