import { UserRole } from "#/modules/user/User.model";
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