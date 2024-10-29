import { Model, Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { IUser, UserMethods } from "./Auth.type";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

type UserModel = Model<IUser, object, UserMethods>;

const userSchema = new Schema<IUser, UserModel, UserMethods>({
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
        required: true,
    },
    created_at: { type: Date, default: Date.now, required: true },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const hashedPassword = await hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

userSchema.method("isValidPassword", async function (password: string): Promise<boolean> {
    const isValid = await compare(password, this.password);
    return isValid;
});

export const User = model<IUser, UserModel>("User", userSchema);
