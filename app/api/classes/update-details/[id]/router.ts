import { Class } from "@/models/class.model";
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

    const {name, course, students, subject, timing, teacher} = await request.json();

    try {
        await connectToDatabase();

        const updatedClass = await Class.findOneAndUpdate({_id: id}, {name, course, students, subject, timing, teacher}, {new: true});

        if (!updatedClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "class updated successfully", updatedClass }, { status: 200 });
    } catch (error) {
        console.error("Error updating class:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}