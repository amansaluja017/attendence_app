import mongoose, { models } from 'mongoose';

interface CourseType {
    _id?: mongoose.Types.ObjectId;
    name: string;
    subjects?: Array<mongoose.Types.ObjectId>;
    createdAt?: Date;
    updatedAt?: Date;
}

const courseSchema = new mongoose.Schema<CourseType>({
    name: {
        type: String,
        required: true
    },
    subjects: [
        {
            type: String,
            required: true
        }
    ],
}, { timestamps: true });

export const Course = models?.Course || mongoose.model<CourseType>("Course", courseSchema);