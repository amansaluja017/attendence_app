import { Admin } from "@/models/admin.model";
import { connectToDatabase } from "@/utils/db";
import { NextResponse } from "next/server";


export async function POST() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    try {
        await connectToDatabase();

        const existingAdmin = await Admin.findOne({email});

        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin already registered" },
                { status: 200 }
            );
        }

        const admin = await Admin.create({ email, password });

        return NextResponse.json(
            { message: "Admin registered successfully", admin },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register admin" },
            { status: 500 }
        );
    }
}