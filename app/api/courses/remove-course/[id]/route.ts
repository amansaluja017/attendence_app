import { Course } from "@/models/courses.model";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest, {params}: {params: {id: string}}) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {id} = params;

    if (!id) {
        return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Class deleted successfully", class: deletedCourse }, { status: 200 });
    } catch (error) {
        console.log("Error deleting course:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}