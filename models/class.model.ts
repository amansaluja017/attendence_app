import mongoose, { models } from 'mongoose';

interface ClassType {
    _id?: mongoose.Types.ObjectId;
    name: string;
    teacher?: mongoose.Types.ObjectId;
    timing?: string;
    course?: mongoose.Types.ObjectId;
    subject?: mongoose.Types.ObjectId;
    students?: Array<mongoose.Types.ObjectId>;
    createdAt?: Date;
    updatedAt?: Date;
}

const classSchema = new mongoose.Schema<ClassType>({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    timing: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
}, { timestamps: true });

export const Class = models?.Class || mongoose.model<ClassType>("Class", classSchema);