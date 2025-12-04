import { Course } from "@/models/courses.model";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    
    if (!id) {
        return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const {name, subjects} = await request.json();

    if (!name || !Array.isArray(subjects)) {
        return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const course = await Course.findOneAndUpdate({_id: id}, {name, subjects}, {new: true});

        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course updated successfully", course }, { status: 200 });
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}