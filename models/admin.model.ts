import mongoose, { models } from 'mongoose';
import bcrypt from 'bcrypt';

interface AdminType {
    _id?: mongoose.Types.ObjectId;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const adminSchema = new mongoose.Schema<AdminType>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

adminSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password!, 10);
    }
});

export const Admin = models?.Admin || mongoose.model<AdminType>("Admin", adminSchema);