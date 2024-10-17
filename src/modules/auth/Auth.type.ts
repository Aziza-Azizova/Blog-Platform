import { UserRole } from "#/modules/auth/Auth.model";
import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  roles: UserRole;
  created_at: Date
}

export interface UserMethods{
  isValidPassword:(password: string) => Promise<boolean>
}