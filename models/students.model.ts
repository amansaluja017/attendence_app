import mongoose, { models } from 'mongoose';
import bcrypt from 'bcrypt';

interface StudentType {
    _id?: mongoose.Types.ObjectId;
    name: string;
    fatherName?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    password?: string;
    courses?: Array<mongoose.Types.ObjectId>;
    classes?: Array<mongoose.Types.ObjectId>;
    createdAt?: Date;
    updatedAt?: Date;
}

const studentSchema = new mongoose.Schema<StudentType>({
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    password: {
        type: String
        
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
}, { timestamps: true });

studentSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password!, 10);
    }
});

export const Student = models?.Student || mongoose.model<StudentType>("Student", studentSchema);