import { Class } from "@/models/class.model";
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
        return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Class deleted successfully", class: deletedClass }, { status: 200 });
    } catch (error) {
        console.log("Error deleting class:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}