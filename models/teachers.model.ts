import mongoose, { models } from 'mongoose';
import bcrypt from 'bcrypt';

interface TeacherType {
    _id?: mongoose.Types.ObjectId;
    name: string;
    subjects?: Array<mongoose.Types.ObjectId>;
    course?: mongoose.Types.ObjectId;
    classes?: Array<mongoose.Types.ObjectId>;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const teacherSchema = new mongoose.Schema<TeacherType>({
    name: {
        type: String,
        required: true
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
}, { timestamps: true });

teacherSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password!, 10);
    }
});

export const Teacher = models?.Teacher || mongoose.model<TeacherType>("Teacher", teacherSchema);